// backend/services/emailService.js
const nodemailer = require('nodemailer');

// Configuração do transporter Gmail com SSL
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false // Ignora certificados auto-assinados
  },
  secure: true, // Usa SSL
  requireTLS: true
});

// Verificar conexão
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Erro na configuração do email:', error);
    console.log('📧 Tentando configuração alternativa...');
  } else {
    console.log('✅ Servidor de email pronto!');
  }
});

// Email de interesse em adoção
exports.enviarEmailInteresse = async (donoPet, interessado, pet) => {
  try {
    const mailOptions = {
      from: `Miaudote <${process.env.EMAIL_USER}>`,
      to: donoPet.email,
      subject: `🎉 Interesse em adotar ${pet.nome}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1976d2;">Alguém está interessado no ${pet.nome}! 🐾</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Informações do Interessado:</h3>
            <p><strong>Nome:</strong> ${interessado.nome}</p>
            <p><strong>Email:</strong> ${interessado.email}</p>
            <p><strong>Telefone:</strong> ${interessado.telefone || 'Não informado'}</p>
          </div>

          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px;">
            <h3>Sobre o Pet:</h3>
            <p><strong>Nome:</strong> ${pet.nome}</p>
            <p><strong>Espécie:</strong> ${pet.especie}</p>
            <p><strong>Raça:</strong> ${pet.raca || 'Não informada'}</p>
          </div>

          <p style="margin-top: 20px;">
            Entre em contato com o interessado o mais breve possível para conversarem sobre a adoção!
          </p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 14px;">
              Atenciosamente,<br>
              Equipe Miaudote 🐕🐈
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email real enviado para:', donoPet.email);
    return result;
  } catch (error) {
    console.error('❌ Erro ao enviar email real:', error);
    throw error;
  }
};

// Email de nova mensagem
exports.enviarEmailNovaMensagem = async (destinatario, remetente, pet) => {
  try {
    const mailOptions = {
      from: `Miaudote <${process.env.EMAIL_USER}>`,
      to: destinatario.email,
      subject: `💬 Nova mensagem sobre ${pet?.nome || 'adoção'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1976d2;">Nova mensagem no Miaudote! ✉️</h2>
          
          <p>Você recebeu uma nova mensagem de <strong>${remetente.nome}</strong>.</p>
          
          ${pet ? `
          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Pet:</strong> ${pet.nome}</p>
          </div>
          ` : ''}

          <p>
            <a href="http://localhost:3000/mensagens" 
               style="background: #1976d2; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 4px; display: inline-block;">
              Ver Mensagem
            </a>
          </p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 14px;">
              Atenciosamente,<br>
              Equipe Miaudote 🐕🐈
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email de mensagem enviado para:', destinatario.email);
    return result;
  } catch (error) {
    console.error('❌ Erro ao enviar email de mensagem:', error);
    throw error;
  }
};