import { sql } from '@vercel/postgres';
import fs from 'fs/promises';
import path from 'path';

// Ruta al archivo JSON local para el fallback de desarrollo
const LOCAL_DB_PATH = path.join(process.cwd(), 'data', 'leads.json');

// Bandera para indicar si estamos usando la base de datos real o el fallback local
const isPostgresEnabled = !!process.env.POSTGRES_URL;

/**
 * Inicializa la base de datos (crea la tabla en Postgres o asegura el archivo JSON local)
 */
export async function initDb() {
  if (isPostgresEnabled) {
    try {
      // Crear tabla en Postgres si no existe
      await sql`
        CREATE TABLE IF NOT EXISTS leads (
          id SERIAL PRIMARY KEY,
          nombre VARCHAR(255) NOT NULL,
          apellidos VARCHAR(255) NOT NULL DEFAULT '',
          telefono VARCHAR(100) NOT NULL,
          ubicacion VARCHAR(100) NOT NULL,
          disciplina VARCHAR(100) NOT NULL,
          clase_gratuita BOOLEAN DEFAULT FALSE,
          descuento_aplicado BOOLEAN DEFAULT FALSE,
          fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;
      // Asegurar que las columnas nuevas existan por si la tabla ya había sido creada antes sin ellas
      await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS apellidos VARCHAR(255) NOT NULL DEFAULT '';`;
      await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS clase_gratuita BOOLEAN DEFAULT FALSE;`;
      await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS descuento_aplicado BOOLEAN DEFAULT FALSE;`;
      console.log('Postgres DB: Tabla "leads" verificada/creada correctamente.');
    } catch (error) {
      console.error('Error al inicializar la base de datos Postgres:', error);
      throw error;
    }
  } else {
    try {
      // Verificar si el archivo local existe, si no, crearlo con un array vacío
      await fs.mkdir(path.dirname(LOCAL_DB_PATH), { recursive: true });
      try {
        await fs.access(LOCAL_DB_PATH);
      } catch {
        await fs.writeFile(LOCAL_DB_PATH, JSON.stringify([], null, 2), 'utf-8');
        console.log('Local DB: Archivo "leads.json" creado correctamente.');
      }
    } catch (error) {
      console.error('Error al inicializar el almacenamiento local:', error);
    }
  }
}

/**
 * Obtiene todos los leads ordenados por fecha descendente
 */
export async function getLeads() {
  await initDb();

  if (isPostgresEnabled) {
    try {
      const { rows } = await sql`
        SELECT * FROM leads ORDER BY fecha DESC;
      `;
      return rows;
    } catch (error) {
      console.error('Error al obtener leads de Postgres:', error);
      throw error;
    }
  } else {
    try {
      const data = await fs.readFile(LOCAL_DB_PATH, 'utf-8');
      const leads = JSON.parse(data);
      // Ordenar por fecha descendente (las más nuevas primero)
      return leads.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    } catch (error) {
      console.error('Error al leer leads locales:', error);
      return [];
    }
  }
}

/**
 * Guarda un nuevo lead
 */
export async function addLead({ nombre, apellidos, telefono, ubicacion, disciplina }) {
  await initDb();

  if (isPostgresEnabled) {
    try {
      const { rows } = await sql`
        INSERT INTO leads (nombre, apellidos, telefono, ubicacion, disciplina)
        VALUES (${nombre}, ${apellidos}, ${telefono}, ${ubicacion}, ${disciplina})
        RETURNING *;
      `;
      console.log('Postgres DB: Lead guardado correctamente.');
      return rows[0];
    } catch (error) {
      console.error('Error al insertar lead en Postgres:', error);
      throw error;
    }
  } else {
    try {
      const data = await fs.readFile(LOCAL_DB_PATH, 'utf-8');
      const leads = JSON.parse(data);

      const newLead = {
        id: Date.now(), // Generar un ID numérico único simple
        nombre,
        apellidos,
        telefono,
        ubicacion,
        disciplina,
        clase_gratuita: false,
        descuento_aplicado: false,
        fecha: new Date().toISOString()
      };

      leads.push(newLead);
      await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(leads, null, 2), 'utf-8');
      console.log('Local DB: Lead guardado correctamente.');
      return newLead;
    } catch (error) {
      console.error('Error al guardar lead localmente:', error);
      throw error;
    }
  }
}

/**
 * Actualiza el estado de clase gratuita o descuento de un lead
 */
export async function updateLeadStatus(id, { clase_gratuita, descuento_aplicado }) {
  await initDb();
  const numericId = parseInt(id, 10);

  if (isPostgresEnabled) {
    try {
      const { rows } = await sql`
        UPDATE leads
        SET clase_gratuita = ${clase_gratuita}, descuento_aplicado = ${descuento_aplicado}
        WHERE id = ${numericId}
        RETURNING *;
      `;
      console.log(`Postgres DB: Lead ${numericId} actualizado.`);
      return rows[0];
    } catch (error) {
      console.error('Error al actualizar lead en Postgres:', error);
      throw error;
    }
  } else {
    try {
      const data = await fs.readFile(LOCAL_DB_PATH, 'utf-8');
      const leads = JSON.parse(data);
      
      let updatedLead = null;
      const updatedLeads = leads.map((lead) => {
        if (parseInt(lead.id, 10) === numericId) {
          updatedLead = {
            ...lead,
            clase_gratuita: clase_gratuita !== undefined ? clase_gratuita : lead.clase_gratuita,
            descuento_aplicado: descuento_aplicado !== undefined ? descuento_aplicado : lead.descuento_aplicado
          };
          return updatedLead;
        }
        return lead;
      });

      if (updatedLead) {
        await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(updatedLeads, null, 2), 'utf-8');
        console.log(`Local DB: Lead ${numericId} actualizado.`);
      }
      return updatedLead;
    } catch (error) {
      console.error('Error al actualizar lead localmente:', error);
      throw error;
    }
  }
}

/**
 * Elimina un lead por ID
 */
export async function deleteLead(id) {
  await initDb();
  const numericId = parseInt(id, 10);

  if (isPostgresEnabled) {
    try {
      const { rowCount } = await sql`
        DELETE FROM leads WHERE id = ${numericId};
      `;
      console.log(`Postgres DB: Lead ${numericId} eliminado. Filas afectadas: ${rowCount}`);
      return rowCount > 0;
    } catch (error) {
      console.error('Error al eliminar lead en Postgres:', error);
      throw error;
    }
  } else {
    try {
      const data = await fs.readFile(LOCAL_DB_PATH, 'utf-8');
      const leads = JSON.parse(data);
      const filteredLeads = leads.filter((lead) => parseInt(lead.id, 10) !== numericId);
      
      const wasDeleted = leads.length !== filteredLeads.length;
      if (wasDeleted) {
        await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(filteredLeads, null, 2), 'utf-8');
        console.log(`Local DB: Lead ${numericId} eliminado correctamente.`);
      }
      return wasDeleted;
    } catch (error) {
      console.error('Error al eliminar lead localmente:', error);
      throw error;
    }
  }
}
