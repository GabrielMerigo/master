import AuthLogo from './extensions/Logo-black.svg';
import favicon from './extensions/Joystick.svg';

export default {
  config: {
    auth: {
      logo: AuthLogo,
    },
    head: {
      favicon: favicon,
    },
    // Override or extend the theme
    theme: {
      colors: {
        primary100: '#f6ecfc',
        primary200: '#d470ff',
        primary500: '#d470ff',
        primary600: '#f08451',
        primary700: '#d470ff',
        danger700: '#b72b1a'
      },
    },
    tutorials: false,
    menu: {
      logo: favicon,
    },
    translations: {
      en: {
        "app.components.LeftMenu.navbrand.title": "Won Games",
        "Auth.form.welcome.title": "Welcome to Won Games",
        "Auth.form.welcome.subtitle": "Log in to your Won Games Account",
        "app.components.HomePage.welcomeBlock.content.again": "We hope you have a good experience with Won Games.",
        "app.components.HomePage.button.blog": "...",
      },
    },
    notifications: { release: false },
    bootstrap() {},
  }
};
