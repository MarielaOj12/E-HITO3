/** Tipos del documento público que se mantiene en public/data/cv.json. */
export interface SocialLink {
  nombre: string;
  icono: string;
  url: string;
}

export interface NavigationItem {
  id: string;
  nombre: string;
  icono: string;
}

export interface CvSkill {
  nombre: string;
  porcentaje: number;
}

export interface CvStudy {
  carrera: string;
  periodo: string;
  institucion: string;
  descripcion: string;
}

export interface CvExperience {
  cargo: string;
  periodo: string;
  lugar: string;
  descripcion: string;
}

export interface PersonalProfile {
  nombre: string;
  titulo_profesional: string;
  descripcion_about: string;
  descripcion_corta: string;
  detalle: string;
  ciudad: string;
  grado: string;
  sitio_web: string;
  foto: string;
  portada: string;
  roles: string[];
  redes: SocialLink[];
}

export interface PortfolioContent {
  configuracion: {
    tituloNavegador: string;
    idioma: string;
    copyright: string;
    mensajeFormularioSinCorreo: string;
    mensajeAbrirCorreo: string;
  };
  perfil: PersonalProfile;
  navegacion: NavigationItem[];
  textos: {
    accesibilidad: Record<string, string>;
    hero: { soy: string };
    etiquetas: Record<string, string>;
    secciones: {
      acerca: { titulo: string };
      habilidades: { titulo: string; descripcion: string };
      curriculum: {
        titulo: string;
        descripcion: string;
        resumen: string;
        educacion: string;
        experiencia: string;
      };
      contacto: {
        titulo: string;
        descripcion: string;
        ubicacion: string;
        telefono: string;
        correo: string;
        nombreCampo: string;
        correoCampo: string;
        asuntoCampo: string;
        mensajeCampo: string;
        enviar: string;
      };
    };
    pie: { derechos: string; diseno: string };
  };
  resumen: { titulo: string; descripcion: string };
  habilidades: CvSkill[];
  educacion: CvStudy[];
  experiencia: CvExperience[];
  contacto: { ubicacion: string; telefono: string; correo: string };
}

export interface DisplayDetail {
  etiqueta: string;
  valor: string;
  icono?: string;
}
