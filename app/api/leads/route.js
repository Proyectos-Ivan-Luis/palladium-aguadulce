import { getLeads, addLead, deleteLead, updateLeadStatus } from '@/lib/db';

const CORRECT_PASSWORD = process.env.ADMIN_PASSWORD || 'Palladium*Campaña!';

/**
 * Helper para verificar la contraseña del administrador.
 * Soporta decodificación URL para caracteres especiales como 'ñ' o acentos en cabeceras HTTP en Vercel.
 */
function verifyAuth(req) {
  const adminPassword = req.headers.get('x-admin-password');
  if (!adminPassword) return false;
  
  try {
    const decoded = decodeURIComponent(adminPassword);
    return decoded === CORRECT_PASSWORD || adminPassword === CORRECT_PASSWORD;
  } catch (e) {
    return adminPassword === CORRECT_PASSWORD;
  }
}

/**
 * POST /api/leads - Guarda un nuevo lead (abierto al público)
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { nombre, apellidos, telefono, ubicacion, disciplina } = body;

    if (!nombre || !apellidos || !telefono || !ubicacion) {
      return Response.json(
        { error: 'Los campos nombre, apellidos, telefono y ubicacion son requeridos y obligatorios.' },
        { status: 400 }
      );
    }

    const newLead = await addLead({
      nombre,
      apellidos,
      telefono,
      ubicacion,
      disciplina: disciplina || 'Desconocida'
    });

    return Response.json(newLead, { status: 201 });
  } catch (error) {
    console.error('Error en POST /api/leads:', error);
    return Response.json(
      { error: 'Error interno del servidor al registrar el lead.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/leads - Obtiene todos los leads (protegido por contraseña)
 */
export async function GET(req) {
  try {
    if (!verifyAuth(req)) {
      return Response.json({ error: 'No autorizado. Contraseña incorrecta.' }, { status: 401 });
    }

    const leads = await getLeads();
    return Response.json(leads);
  } catch (error) {
    console.error('Error en GET /api/leads:', error);
    return Response.json(
      { error: 'Error interno del servidor al obtener los leads.' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/leads - Actualiza el estado de un lead (protegido por contraseña)
 */
export async function PUT(req) {
  try {
    if (!verifyAuth(req)) {
      return Response.json({ error: 'No autorizado. Contraseña incorrecta.' }, { status: 401 });
    }

    const body = await req.json();
    const { id, clase_gratuita, descuento_aplicado } = body;

    if (!id) {
      return Response.json({ error: 'Se requiere el ID del lead para actualizar.' }, { status: 400 });
    }

    const updatedLead = await updateLeadStatus(id, { clase_gratuita, descuento_aplicado });
    if (updatedLead) {
      return Response.json({ success: true, lead: updatedLead });
    } else {
      return Response.json({ error: `No se encontró ningún lead con ID ${id}.` }, { status: 404 });
    }
  } catch (error) {
    console.error('Error en PUT /api/leads:', error);
    return Response.json(
      { error: 'Error interno del servidor al actualizar el lead.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/leads - Elimina un lead por ID (protegido por contraseña)
 */
export async function DELETE(req) {
  try {
    if (!verifyAuth(req)) {
      return Response.json({ error: 'No autorizado. Contraseña incorrecta.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'Se requiere el ID del lead para eliminar.' }, { status: 400 });
    }

    const success = await deleteLead(id);
    if (success) {
      return Response.json({ success: true, message: `Lead ${id} eliminado correctamente.` });
    } else {
      return Response.json({ error: `No se encontró ningún lead con ID ${id}.` }, { status: 404 });
    }
  } catch (error) {
    console.error('Error en DELETE /api/leads:', error);
    return Response.json(
      { error: 'Error interno del servidor al eliminar el lead.' },
      { status: 500 }
    );
  }
}
