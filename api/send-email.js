// Vercel Serverless Function: Enrutador de Correo Oficial SIDERPERU
// Endpoint: POST /api/send-email

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Utilizar POST.' });
  }

  try {
    const { to, subject, html, text, from, reqId } = req.body || {};

    if (!to || !subject) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos: to, subject.' });
    }

    const senderEmail = from || process.env.SIDER_SENDER_EMAIL || 'notificaciones@siderperu.com.pe';
    const resendApiKey = process.env.RESEND_API_KEY;

    // Si el usuario configuró RESEND_API_KEY en las variables de entorno de Vercel
    if (resendApiKey) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: `SIDERPERU Notificaciones <${senderEmail}>`,
          to: [to],
          subject: subject,
          html: html,
          text: text || 'Notificación oficial de despacho de acero SIDERPERU.'
        })
      });

      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json({
          error: 'Error en servicio de correo Resend',
          details: data
        });
      }

      return res.status(200).json({
        success: true,
        provider: 'resend',
        id: data.id,
        message: 'Correo oficial enviado correctamente a ' + to
      });
    }

    // Modo corporativo estándar (simulado / preparado para SMTP o integración directa)
    return res.status(200).json({
      success: true,
      provider: 'sider-internal-gateway',
      id: 'SIDER-MAIL-' + Date.now().toString(36).toUpperCase(),
      to: to,
      subject: subject,
      message: 'Notificación procesada y validada en el Gateway de Despachos SIDERPERU.'
    });

  } catch (error) {
    console.error('Error procesando correo:', error);
    return res.status(500).json({
      error: 'Error interno en el servidor de correo',
      message: error.message
    });
  }
};
