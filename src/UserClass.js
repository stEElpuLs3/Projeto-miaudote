// src/UserClass.js

export class UserClass {
  constructor(name, phone, email, password, avatar, favorites) {
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.password = password;
    this.avatar = avatar;
    this.logado = false;
    this.favorites = favorites || [];
    console.log("Criando usuário");
  }

  // Salva o usuário no localStorage
  static SaveUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  // Retorna o usuário atual salvo no localStorage
  static GetUser() {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  }

  // Remove o usuário (logout)
  static Logout() {
    localStorage.removeItem("user");
  }

  // Verifica se alguém está logado
  static IsLoggedIn() {
    return !!localStorage.getItem("user");
  }
}
