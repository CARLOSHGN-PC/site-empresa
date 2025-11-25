
export const AuthService = {
  isAuthenticated: (): boolean => {
    return sessionStorage.getItem('cacu_admin_auth') === 'true';
  },

  login: (password: string): boolean => {
    // Senha definida aqui. Em um app real, isso viria de um servidor.
    if (password === 'cacu2025') {
      sessionStorage.setItem('cacu_admin_auth', 'true');
      return true;
    }
    return false;
  },

  logout: () => {
    sessionStorage.removeItem('cacu_admin_auth');
  }
};
