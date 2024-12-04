import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

export async function POST(req: Request): Promise<Response> {
	try {
		const { name, email, message } = await req.json()

		if (!name || !email || !message) {
			return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 })
		}

		// Визначаємо тип для опцій транспорту
		const transportOptions: SMTPTransport.Options = {
			host: process.env.SMTP_HOST,
			port: parseInt(process.env.SMTP_PORT || '587', 10),
			secure: process.env.SMTP_PORT === '465',
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD,
			},
		}

		const transporter = nodemailer.createTransport(transportOptions)

		const mailOptions = {
			from: `"${name}" <${email}>`,
			to: process.env.RECIPIENT_EMAIL,
			subject: `Wiadomość ze strony spokosopot.pl`,
			text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
		}

		// Відправка листа
		await transporter.sendMail(mailOptions)

		return new Response(JSON.stringify({ message: 'Message sent successfully!' }), { status: 200 })
	} catch (error) {
		console.error('Error sending email:', error)
		return new Response(JSON.stringify({ error: 'Failed to send message' }), { status: 500 })
	}
}
