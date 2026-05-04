import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import jwt from 'jsonwebtoken';

// 🔴 SECURITY: hardcoded secrets
const JWT_SECRET = 'minha_chave_super_secreta_123';
const ADMIN_PASSWORD = 'admin123';
const API_KEY = 'sk-prod-abc-xyz-789';

// 🔴 ARCHITECTURE: controller acessando Prisma direto (viola convenção)
const prisma = new PrismaClient();

class BadExampleController {
  // 🔴 COMPLEXITY: função com complexidade ciclomática alta (muitos ifs aninhados)
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      var name = req.body.name; // 🔴 STYLE: var em vez de const
      let email = req.body.email;
      let password = req.body.password;
      let phone = req.body.phone;
      let unusedVariable = 'nunca uso isso'; // 🔴 unused variable

      // 🔴 sem validação Zod (viola convenção do projeto)
      if (name) {
        if (email) {
          if (password) {
            if (password.length > 6) {
              if (email.includes('@')) {
                if (phone || !phone) {
                  // 🔴 SECURITY: hash fraco (MD5)
                  const hashedPassword = crypto
                    .createHash('md5')
                    .update(password)
                    .digest('hex');

                  // 🔴 == em vez de ===
                  if (email == 'admin@test.com') {
                    console.log('admin criado!'); // 🔴 console.log esquecido
                  }

                  const user = await prisma.user.create({
                    data: { name, email, password: hashedPassword, phone },
                  });

                  // 🔴 ARCHITECTURE: res.send direto (viola convenção crítica do projeto)
                  return res
                    .status(201)
                    .send({
                      user,
                      token: jwt.sign({ id: user.id }, JWT_SECRET),
                    });
                }
              }
            }
          }
        }
      }

      // 🔴 res.json direto em caso de erro (deveria usar next)
      return res.status(400).json({ error: 'dados inválidos' });
    } catch (error) {
      // 🔴 catch que engole o erro silenciosamente
      console.log(error);
      return res.status(500).send('erro');
    }
  }

  // 🔴 SECURITY: SQL injection via $queryRawUnsafe
  async searchUsers(req: Request, res: Response) {
    const search = req.query.search as string;
    const users = await prisma.$queryRawUnsafe(
      `SELECT * FROM "User" WHERE name LIKE '%${search}%'`,
    );
    res.send(users); // 🔴 expõe password hash do usuário na resposta
  }

  // 🔴 DUPLICATION: lógica de hash duplicada (vai ser flagged como duplicate code)
  async updatePassword(req: Request, res: Response) {
    const userId = req.params.id;
    const newPassword = req.body.password;

    const hashedPassword = crypto
      .createHash('md5')
      .update(newPassword)
      .digest('hex');

    // 🔴 magic numbers sem explicação
    if (newPassword.length < 6 || newPassword.length > 128) {
      return res.status(400).send('senha inválida');
    }

    const tokenExpiry = 86400 * 7; // 🔴 o que é isso?

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return res.send({ ok: true, expiresIn: tokenExpiry });
  }

  // 🔴 função morta (nunca usada em rota nenhuma)
  deadFunction(a: any, b: any, c: any) {
    // 🔴 uso de 'any'
    return a + b;
  }
}

export default new BadExampleController();
