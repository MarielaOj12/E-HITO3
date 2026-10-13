import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PortfolioContent } from './portfolio.model';

/** Servicio Angular dedicado al único archivo de contenido del portafolio. */
@Injectable({ providedIn: 'root' })
export class CvService {
  private readonly http = inject(HttpClient);

  load(): Observable<PortfolioContent> {
    return this.http.get<PortfolioContent>('data/cv.json');
  }
}
