import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  computed,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CvService } from './core/cv.service';
import {
  CvSkill,
  DisplayDetail,
  PortfolioContent,
  SocialLink
} from './core/portfolio.model';

/**
 * E-HITO3: portafolio personal con Angular y Bootstrap.
 * Todos los textos, enlaces, fotografías y datos visibles se obtienen
 * de public/data/cv.json. No utiliza MariaDB ni un backend PHP.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly cvService = inject(CvService);
  private readonly destroyRef = inject(DestroyRef);
  private typedInstance: { destroy(): void } | null = null;

  readonly currentYear = new Date().getFullYear();
  readonly cv = signal<PortfolioContent | null>(null);
  readonly loadingMessage = signal('Cargando portafolio…');
  readonly mobileOpen = signal(false);
  readonly scrolled = signal(false);
  readonly activeSection = signal('hero');
  readonly feedback = signal('');
  readonly feedbackClass = signal('');

  readonly skillColumns = computed<CvSkill[][]>(() => {
    const skills = this.cv()?.habilidades ?? [];
    const midpoint = Math.ceil(skills.length / 2);
    return [skills.slice(0, midpoint), skills.slice(midpoint)];
  });

  readonly visibleSocials = computed<SocialLink[]>(() =>
    (this.cv()?.perfil.redes ?? [])
      .filter((red) => !!this.safeUrl(red.url))
      .map((red) => ({ ...red, url: this.safeUrl(red.url)! }))
  );

  readonly profileDetailsLeft = computed<DisplayDetail[]>(() => {
    const data = this.cv();
    if (!data) return [];

    return [
      { etiqueta: data.textos.etiquetas['ciudad'], valor: data.perfil.ciudad },
      { etiqueta: data.textos.etiquetas['grado'], valor: data.perfil.grado }
    ].filter((dato) => !!dato.valor);
  });

  readonly profileDetailsRight = computed<DisplayDetail[]>(() => {
    const data = this.cv();
    if (!data) return [];

    return [
      { etiqueta: data.textos.etiquetas['sitioWeb'], valor: data.perfil.sitio_web },
      { etiqueta: data.textos.etiquetas['correo'], valor: data.contacto.correo }
    ].filter((dato) => !!dato.valor);
  });

  readonly contactDetails = computed<DisplayDetail[]>(() => {
    const data = this.cv();
    if (!data) return [];

    return [
      {
        etiqueta: data.textos.secciones.contacto.ubicacion,
        valor: data.contacto.ubicacion,
        icono: 'bi-geo-alt'
      },
      {
        etiqueta: data.textos.secciones.contacto.telefono,
        valor: data.contacto.telefono,
        icono: 'bi-telephone'
      },
      {
        etiqueta: data.textos.secciones.contacto.correo,
        valor: data.contacto.correo,
        icono: 'bi-envelope'
      }
    ].filter((dato) => !!dato.valor);
  });

  constructor() {
    this.cvService.load()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          if (!this.isValidData(data)) {
            this.loadingMessage.set('El archivo data/cv.json contiene información incompleta.');
            return;
          }

          document.title = data.configuracion.tituloNavegador;
          document.documentElement.lang = data.configuracion.idioma || 'es';
          this.cv.set(data);

          // Los efectos se activan después de que Angular dibuja la plantilla.
          setTimeout(() => this.initializeVisuals(), 150);
        },
        error: (error: unknown) => {
          console.error('Error al cargar data/cv.json:', error);
          this.loadingMessage.set('No se pudo leer data/cv.json. Inicia el servidor Angular.');
        }
      });

    this.destroyRef.onDestroy(() => this.typedInstance?.destroy());
  }

  private isValidData(data: PortfolioContent): boolean {
    return Boolean(
      data?.perfil?.nombre &&
      data?.configuracion &&
      data?.textos?.secciones &&
      Array.isArray(data.navegacion) &&
      Array.isArray(data.habilidades) &&
      Array.isArray(data.educacion) &&
      Array.isArray(data.experiencia)
    );
  }

  private safeUrl(url: string): string | null {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:' || parsed.protocol === 'http:'
        ? parsed.href
        : null;
    } catch {
      return null;
    }
  }

  /** Admite únicamente recursos locales de la carpeta de imágenes. */
  localImage(path: string): string {
    return /^assets\/img\/(?!.*\.\.)[a-zA-Z0-9_./-]+\.(?:jpe?g|png|webp|svg)$/i.test(path)
      ? path
      : 'assets/img/Ruth.jpeg';
  }

  image(field: 'perfil.foto' | 'perfil.portada'): string {
    const value = field === 'perfil.foto'
      ? this.cv()?.perfil.foto
      : this.cv()?.perfil.portada;

    return this.localImage(value ?? '');
  }

  anchor(id: string): string {
    return /^(hero|about|skills|resume|contact)$/.test(id) ? `#${id}` : '#hero';
  }

  safeIcon(icon: string): string {
    return /^bi-[a-z0-9-]+$/.test(icon) ? icon : 'bi-circle';
  }

  clampPercentage(value: number): number {
    return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  }

  text(path: 'textos.accesibilidad.alternarMenu' | 'textos.accesibilidad.menuPrincipal' | 'textos.accesibilidad.fotoPerfil' | 'textos.accesibilidad.fotoPortada'): string {
    const key = path.split('.').at(-1) || '';
    return this.cv()?.textos.accesibilidad[key] || '';
  }

  toggleMobile(): void {
    this.mobileOpen.update((isOpen) => !isOpen);
  }

  onNavigation(): void {
    this.mobileOpen.set(false);
  }

  scrollToTop(event: MouseEvent): void {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 100);
    const position = window.scrollY + 200;
    let current = 'hero';

    for (const section of this.cv()?.navegacion ?? []) {
      const element = document.getElementById(section.id);
      if (element && position >= element.offsetTop) {
        current = section.id;
      }
    }

    this.activeSection.set(current);
  }

  submitContact(event: Event): void {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement | null;
    const data = this.cv();
    if (!form || !data || !form.reportValidity()) return;

    const recipient = data.contacto.correo.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
      this.feedbackClass.set('alert alert-warning');
      this.feedback.set(data.configuracion.mensajeFormularioSinCorreo);
      return;
    }

    const fields = new FormData(form);
    const name = String(fields.get('nombre') ?? '');
    const senderEmail = String(fields.get('email') ?? '');
    const subject = String(fields.get('asunto') ?? '');
    const message = String(fields.get('mensaje') ?? '');
    const body = `Nombre: ${name}\nCorreo: ${senderEmail}\n\n${message}`;

    this.feedbackClass.set('alert alert-info');
    this.feedback.set(data.configuracion.mensajeAbrirCorreo);

    // Sin backend: abre el cliente de correo, no afirma que se haya enviado.
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  private initializeVisuals(): void {
    type VisualGlobals = Window & {
      AOS?: { init(options: Record<string, unknown>): void; refresh(): void };
      Typed?: new (selector: string, options: Record<string, unknown>) => { destroy(): void };
    };
    const globals = window as VisualGlobals;

    try {
      globals.AOS?.init({ duration: 650, easing: 'ease-in-out', once: true });
      globals.AOS?.refresh();

      const roles = this.cv()?.perfil.roles ?? [];
      if (globals.Typed && roles.length) {
        this.typedInstance?.destroy();
        this.typedInstance = new globals.Typed('.typed', {
          strings: roles,
          loop: true,
          typeSpeed: 80,
          backSpeed: 45,
          backDelay: 1900
        });
      }

      this.onScroll();
      if (location.hash) {
        document.getElementById(location.hash.slice(1))?.scrollIntoView();
      }
    } catch (error) {
      console.warn('No se pudieron activar todas las animaciones:', error);
    }
  }
}
