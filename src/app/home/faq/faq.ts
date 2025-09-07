import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';
import { FormsModule } from '@angular/forms';

type FaqItem = { q: string; a: string; category?: string; };

@Component({
  standalone: true,
  selector: 'app-faq',
  templateUrl: './faq.html',
  imports: [
    CommonModule, RouterModule, FormsModule,
    AccordionModule, InputTextModule, ButtonModule, DividerModule, CardModule, TagModule,
    Navbar, Footer
  ]
})
export class Faq {
  // barre de recherche
  query = signal('');
  openPanels: any[] = []; // ex: [] fermé par défaut, ou [0] pour ouvrir le 1er
  // filtre par catégorie (optionnel)
  activeCategory = signal<string | null>(null);

  faqs = signal<FaqItem[]>([
    { q: 'How do I track my order?', a: 'You can track your order from the “My Orders” section in your account. We also email a tracking link once the parcel ships.', category: 'Orders' },
    { q: 'What is your return policy?', a: '30-day returns. Items must be unused and in original packaging. Refunds are issued to the original payment method within 5–7 business days.', category: 'Returns' },
    { q: 'How long does shipping take?', a: 'Standard delivery: 3–5 business days. Express: 1–2 business days. International shipments vary based on destination.', category: 'Shipping' },
    { q: 'Which payment methods are accepted?', a: 'We accept major credit/debit cards, PayPal, and Apple/Google Pay in supported regions.', category: 'Payments' },
    { q: 'Can I change or cancel my order?', a: 'You can request a change/cancellation within 30 minutes of placing the order from “My Orders”, if it is not yet processed.', category: 'Orders' },
    { q: 'Do you ship internationally?', a: 'Yes, we ship to most countries. Duties/taxes may apply depending on your local regulations.', category: 'Shipping' },
    { q: 'Is my payment secure?', a: 'Transactions are processed via PCI-DSS compliant gateways over HTTPS with 3-D Secure where available.', category: 'Payments' },
  ]);

  categories = computed(() => {
    const set = new Set(this.faqs().map(f => f.category || 'General'));
    return Array.from(set);
  });

  filteredFaqs = computed(() => {
    const q = this.query().trim().toLowerCase();
    const cat = this.activeCategory();
    return this.faqs().filter(f => {
      const inCat = !cat || (f.category || 'General') === cat;
      const inText = !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
      return inCat && inText;
    });
  });

  clearCategory() { this.activeCategory.set(null); }
  setCategory(c: string) { this.activeCategory.set(c); }
}
