import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Product } from '../../../models/product.model';
import { Category } from '../../../models/category.model';

import { SelectModule } from 'primeng/select';
import { CategoryService } from '../../../services/category.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FileUpload } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';

import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ImageModule } from 'primeng/image';

@Component({
  standalone: true,
  selector: 'app-edit-product-dialog',
  templateUrl: './edit-product-dialog.html',
  imports: [
    DialogModule,
    InputText,
    ButtonModule,
    FormsModule,
    SelectModule,
    FileUpload,
    CommonModule,
    ImageModule,
    Toast
  ],
  providers: [MessageService],
  styleUrls: ['./edit-product-dialog.scss']

  
})

export class EditProductDialog implements OnChanges, OnDestroy {
  @Input() product: Product | null = null;
  @Input() visible: boolean = false;

  @Output() save = new EventEmitter<Product>();
  @Output() cancel = new EventEmitter<void>();
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() isSaving = false;

  formData: Product = {} as Product;
  categories: Category[] = [];


  selectedFile: File | null = null;
  imagePreviewUrl?: string;
  private imagePreviewIsObjectUrl = false;

  private readonly MAX_BYTES = 5_000_000;

  constructor(
    private cdRef: ChangeDetectorRef,
    private categoryService: CategoryService,
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && this.product) {
      this.formData = { ...this.product };
      if (this.product.idCategory) {
        this.formData.idCategory = this.product.idCategory;
      }

      console.log('Editing product:', this.formData);
      
      this.setPreviewFromExisting(this.formData.image_url);

      this.cdRef.detectChanges();
    }
  }

  
  ngOnDestroy() {
    this.revokePreviewUrl();
  }

  // ====== Image handling (pas d’upload ici) ======
  onFileSelect(e: { files: File[] }) {
    const file = e?.files?.[0];
    if (!file) return;

    // validations côté client
    if (file.size > this.MAX_BYTES) {
      this.toastError('Image trop lourde', 'Taille maximale : 5 Mo');
      this.clearSelectedImage();
      return;
    }
    if (!file.type.startsWith('image/')) {
      this.toastError('Format invalide', 'Veuillez choisir un fichier image');
      this.clearSelectedImage();
      return;
    }

    // ok -> stocker + preview
    this.selectedFile = file;
    this.makePreview(file);
  }

  onClearFile() {
    this.clearSelectedImage();
  }

  private setPreviewFromExisting(url?: string) {
  // on ne revoke que les Object URLs
  if (this.imagePreviewIsObjectUrl && this.imagePreviewUrl) {
    URL.revokeObjectURL(this.imagePreviewUrl);
  }
  this.imagePreviewUrl = url || undefined;
  this.imagePreviewIsObjectUrl = false;
}

private makePreview(file: File) {
  if (this.imagePreviewIsObjectUrl && this.imagePreviewUrl) {
    URL.revokeObjectURL(this.imagePreviewUrl);
  }
  this.imagePreviewUrl = URL.createObjectURL(file);
  this.imagePreviewIsObjectUrl = true;
}

private revokePreviewUrl() {
  if (this.imagePreviewIsObjectUrl && this.imagePreviewUrl) {
    URL.revokeObjectURL(this.imagePreviewUrl);
  }
  this.imagePreviewUrl = undefined;
  this.imagePreviewIsObjectUrl = false;
}

private clearSelectedImage() {
  this.selectedFile = null;
  // Revenir à l'image serveur du produit si elle existe
  this.setPreviewFromExisting(this.formData?.image_url);
}

  // ====== Save ======
  async onSave() {
    if (this.isSaving) return;

    // sécuriser la catégorie
    const selectedCategory = this.categories.find(c => c.id === this.formData.idCategory);
    if (selectedCategory) {
      this.formData.idCategory = selectedCategory.id;
    }

    try {
      // 1) si une image est sélectionnée, uploader d'abord pour récupérer l'URL
      if (this.selectedFile) {
        const fd = new FormData();
        fd.append('file', this.selectedFile);

        // ton endpoint existant
        const res = await this.http.post<{ url: string }>('http://localhost:8080/api/files/upload', fd, {
          reportProgress: true,
          observe: 'body'
        }).toPromise();

        if (res?.url) {
          this.formData.image_url = 'http://localhost:8080' + res.url;
        }
      }

      // 2) ensuite seulement on émet le produit complet
      this.save.emit(this.formData);
      // NB: le parent fera la création/màj du produit ; ici on n’envoie rien d’autre

    } catch (err) {
      const e = err as HttpErrorResponse;
      if (e.status === 413) {
        this.toastError('Image trop lourde', 'Le serveur a refusé (413). Réduis la taille de l’image.');
      } else {
        this.toastError('Échec de l’upload', e.error?.message || e.message || 'Erreur inconnue');
        this.toastError('Image trop lourde', 'Le serveur a refusé (413). Réduis la taille de l’image.');
      }
    }
  }

  onCancel() {
    if (this.isSaving) return;
    this.cancel.emit();
    this.visibleChange.emit(false);
  }

  // ====== Helpers toast ======
  private toastError(summary: string, detail?: string) {
    this.messageService.add({ severity: 'error', summary, detail });
  }
  private toastInfo(summary: string, detail?: string) {
    this.messageService.add({ severity: 'info', summary, detail });
  }

  
}
