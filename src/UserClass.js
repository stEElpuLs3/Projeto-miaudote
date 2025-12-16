// src/UserClass.js - VERSÃO ATUALIZADA
export class UserClass {
  constructor(data) {
    this._id = data._id || data.id;
    this.name = data.nome || data.name;
    this.phone = data.telefone || data.phone;
    this.email = data.email;
    this.password = data.senha || data.password;
    this.avatar = data.avatar;
    this.logado = true; // Sempre true quando criado do backend
    this.favorites = data.favoritos || data.favorites || [];
    this.socialMedia = data.redeSocial || data.socialMedia;
    this.address = data.endereco || data.address;
    this.about = data.sobre || data.about;
  }

  // Salva o usuário do backend no localStorage
  static SaveUserFromBackend(backendUser) {
    const frontendUser = {
      _id: backendUser.id,
      name: backendUser.nome,
      email: backendUser.email,
      phone: backendUser.telefone,
      avatar: backendUser.avatar,
      logado: true,
      favorites: backendUser.favoritos || [],
      socialMedia: backendUser.redeSocial,
      address: backendUser.endereco,
      about: backendUser.sobre,
      token: backendUser.token // Salvar token se necessário
    };
    
    localStorage.setItem("user", JSON.stringify(frontendUser));
    return frontendUser;
  }

  // Retorna o usuário atual
  static GetUser() {
    const data = localStorage.getItem("user");
    if (!data) return null;
    
    const user = JSON.parse(data);
    
    // Garantir URL completa para o avatar
    if (user.avatar && !user.avatar.startsWith('http') && user.avatar.startsWith('/uploads')) {
      user.avatar = `http://localhost:3001${user.avatar}`;
    }
    
    return user;
  }

  // Atualiza apenas o avatar
  static UpdateAvatar(avatarUrl) {
    const user = this.GetUser();
    if (user) {
      user.avatar = avatarUrl;
      this.SaveUser(user);
      return user;
    }
    return null;
  }

  // Salva usuário (para compatibilidade)
  static SaveUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  // Logout
  static Logout() {
    localStorage.removeItem("user");
  }

  // Verifica login
  static IsLoggedIn() {
    const user = this.GetUser();
    return !!(user && user.logado);
  }
}