import { AuthService } from './auth-service';
import { storage } from '../storage';
import type { InsertAdminUser } from '@shared/schema';

export class AdminSeeder {
  /**
   * Criar usuário admin inicial
   */
  static async createInitialAdmin(): Promise<void> {
    try {
      // Verificar se já existe algum admin
      const existingAdmins = await storage.getAllAdminUsers();
      if (existingAdmins.length > 0) {
        console.log('✅ [SEEDER] Admin users já existem, não criando novos');
        return;
      }

      console.log('🌱 [SEEDER] Criando usuários admin iniciais...');

      // Admin principal
      const adminPassword = await AuthService.hashPassword('pizzaria123');
      const adminUser: InsertAdminUser = {
        username: 'admin',
        email: 'admin@pizzaria.com',
        passwordHash: adminPassword,
        role: 'admin',
        isActive: true,
      };

      const createdAdmin = await storage.createAdminUser(adminUser);
      console.log('✅ [SEEDER] Admin criado:', {
        id: createdAdmin.id,
        username: createdAdmin.username,
        email: createdAdmin.email,
        role: createdAdmin.role
      });

      // Manager adicional
      const managerPassword = await AuthService.hashPassword('manager123');
      const managerUser: InsertAdminUser = {
        username: 'manager',
        email: 'manager@pizzaria.com',
        passwordHash: managerPassword,
        role: 'manager',
        isActive: true,
      };

      const createdManager = await storage.createAdminUser(managerUser);
      console.log('✅ [SEEDER] Manager criado:', {
        id: createdManager.id,
        username: createdManager.username,
        email: createdManager.email,
        role: createdManager.role
      });

      console.log('🎉 [SEEDER] Usuários admin iniciais criados com sucesso!');
      console.log('📝 [SEEDER] Credenciais de acesso:');
      console.log('   Admin: admin / pizzaria123');
      console.log('   Manager: manager / manager123');

    } catch (error) {
      console.error('❌ [SEEDER] Erro ao criar admin users:', error);
      throw error;
    }
  }

  /**
   * Atualizar senha de admin existente
   */
  static async updateAdminPassword(username: string, newPassword: string): Promise<boolean> {
    try {
      const admin = await storage.getAdminByUsername(username);
      if (!admin) {
        console.error(`❌ [SEEDER] Admin '${username}' não encontrado`);
        return false;
      }

      const hashedPassword = await AuthService.hashPassword(newPassword);
      const updated = await storage.updateAdminUser(admin.id, {
        passwordHash: hashedPassword,
        updatedAt: new Date()
      });

      if (updated) {
        console.log(`✅ [SEEDER] Senha do admin '${username}' atualizada`);
        return true;
      } else {
        console.error(`❌ [SEEDER] Falha ao atualizar senha do admin '${username}'`);
        return false;
      }
    } catch (error) {
      console.error('❌ [SEEDER] Erro ao atualizar senha:', error);
      return false;
    }
  }

  /**
   * Listar todos os admins (sem senhas)
   */
  static async listAdmins(): Promise<void> {
    try {
      const admins = await storage.getAllAdminUsers();
      console.log(`📋 [SEEDER] ${admins.length} admin(s) encontrado(s):`);
      
      admins.forEach((admin, index) => {
        console.log(`  ${index + 1}. ${admin.username} (${admin.email}) - ${admin.role} - ${admin.isActive ? 'Ativo' : 'Inativo'}`);
      });
    } catch (error) {
      console.error('❌ [SEEDER] Erro ao listar admins:', error);
    }
  }
}