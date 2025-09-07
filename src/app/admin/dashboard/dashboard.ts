import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

// Tes modèles
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

// Tes services
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { CategoryService } from '../../services/category.service';

// RxJS
import { forkJoin } from 'rxjs';

// Si tu n'as pas encore de modèle Order côté front, on tape souple :
type Order = {
  id?: number;
  created_at?: string | Date;
  total?: number;
  items?: Array<{ productId?: number; qty?: number; price?: number }>;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  imports: [CommonModule, RouterModule, RouterOutlet, CardModule, ChartModule]
})
export class Dashboard implements OnInit {
  // État
  loading = true;

  // Charts data/options
  ordersData: any;     ordersOptions: any;
  categoriesData: any; categoriesOptions: any;
  revenueData: any;    revenueOptions: any;

  constructor(
    private products: ProductService,
    private orders: OrderService,
    private categoriesService: CategoryService
  ) {}

  ngOnInit() {
    // Charge produits, commandes et catégories en parallèle
    forkJoin({
      prods: this.products.getAll(),
      ords: this.orders.getOrders(),
      cats: this.categoriesService.getCategories()
    }).subscribe({
      next: ({ prods, ords, cats }) => {
        console.log('Dashboard data loaded', { prods, ords, cats });
        this.buildCategoriesChart(prods ?? [], cats ?? []);
        this.buildOrdersChart(ords ?? []);
        this.buildRevenueChart(ords ?? []);
      },
      error: (err) => {
        console.error('Dashboard load failed', err);
        // Fallbacks vides pour ne pas casser l'affichage
        this.ordersData     = { labels: [], datasets: [{ label: 'Orders', data: [] }] };
        this.categoriesData = { labels: [], datasets: [{ data: [] }] };
        this.revenueData    = { labels: [], datasets: [{ label: 'Revenue', data: [] }] };
      },
      complete: () => this.loading = false
    });
  }

  /** Répartition des produits par catégorie (label de catégorie) */
  private buildCategoriesChart(products: Product[], cats: Category[]) {
  // Map rapide id→name pour lookup O(1)
  const catNameById = new Map<number, string>();
  for (const c of cats) catNameById.set(c.id, c.name);

  // Compte des produits par nom de catégorie
  const group: Record<string, number> = {};
  for (const pr of products) {
    const catName = catNameById.get(pr.idCategory) ?? 'Unknown';
    group[catName] = (group[catName] || 0) + 1;
  }

  const labels = Object.keys(group);
  const counts = labels.map(l => group[l]);

  this.categoriesData = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: [
          '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
          '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e'
        ]
      }
    ]
  };

  this.categoriesOptions = {
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };
}

  /** Nombre de commandes par mois (12 derniers mois) */
  private buildOrdersChart(orders: Order[]) {
    const { labels, mapIndex } = last7DaysLabels();
    const counts = new Array(labels.length).fill(0);

    for (const ord of orders) {
      const d = toDate(ord.created_at);
      if (!d) continue;
      const idx = mapIndex(d);
      if (idx >= 0) counts[idx] += 1;
    }

    this.ordersData = {
      labels,
      datasets: [
        { label: 'Orders', data: counts, tension: 0.35, fill: false }
      ]
    };

    this.ordersOptions = {
      maintainAspectRatio: false,
      plugins: { legend: { display: true } },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true }
      }
    };
  }

  /** Chiffre d’affaires par mois (12 derniers mois) */
  private buildRevenueChart(orders: Order[]) {
    const { labels, mapIndex } = last7DaysLabels();
    const revenue = new Array(labels.length).fill(0);

    for (const ord of orders) {
      const d = toDate(ord.created_at);
      if (!d) continue;
      const idx = mapIndex(d);
      if (idx < 0) continue;

      // Utilise total si fourni; sinon recalcule depuis items
      const total = (ord.total != null)
        ? ord.total
        : (ord.items || []).reduce((s, it) => s + ((it.price ?? 0) * (it.qty ?? 0)), 0);

      revenue[idx] += total;
    }

    this.revenueData = {
      labels,
      datasets: [
        { label: 'Revenue', data: revenue }
      ]
    };

    this.revenueOptions = {
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true }
      }
    };
  }
}

/** Helpers temps & format */
function toDate(value: any): Date | null {
  if (!value) return null;
  const d = (value instanceof Date) ? value : new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function last7DaysLabels() {
  const now = new Date();
  const labels: string[] = [];
  const dayKeys: Array<{ y: number; m: number; d: number }> = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i); // reculer de i jours
    labels.push(d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }));
    dayKeys.push({ y: d.getFullYear(), m: d.getMonth(), d: d.getDate() });
  }

  const mapIndex = (dt: Date) => {
    const y = dt.getFullYear(), m = dt.getMonth(), d = dt.getDate();
    return dayKeys.findIndex(k => k.y === y && k.m === m && k.d === d);
  };

  return { labels, mapIndex };
}

