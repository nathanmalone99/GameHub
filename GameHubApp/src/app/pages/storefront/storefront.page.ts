import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { RawgService } from 'src/app/services/rawg.service';

@Component({
  selector: 'app-storefront',
  templateUrl: './storefront.page.html',
  styleUrls: ['./storefront.page.scss'],
})
export class StorefrontPage implements OnInit {

  games: any[] = [];
  currentPage = 1;
  totalPages = 0;
  pageSize = 21;
  loading = false;
  filters = {
    search: '',
    genres: '',
    platforms: '',
    ordering: ''
  };

  constructor(private rawgService: RawgService, private cartService: CartService) { }

  ngOnInit() {
    this.loadGames();
  }

  loadGames() {
    if (this.loading) return;

    this.loading = true;
    this.rawgService.getGames(this.currentPage, this.pageSize, this.filters).subscribe(
      (response) => {
        console.log('API response:', response);

        if (response && response.results) {
          this.games = response.results;
          this.totalPages = Math.ceil(response.count / this.pageSize);
        }

        this.loading = false;
      },
      (error) => {
        console.error('API error:', error);
        this.loading = false;
      }
    );
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadGames();
  }

  clearFilters() {
    this.filters = {
      search: '',
      genres: '',
      platforms: '',
      ordering: ''
    };
    this.applyFilters();
  }

  goToPage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadGames();
    }
  }

  goToFirstPage() {
    this.goToPage(1);
  }

  goToLastPage() {
    this.goToPage(this.totalPages);
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  addToCart(game: any) {
    const gameWithPrice = { ...game, price: this.generateRandomPriceInEuros() };
    this.cartService.addToCart(gameWithPrice);
    console.log('Added to cart with price:', gameWithPrice.price);
  }

  generateRandomPriceInEuros() {
    const min = 20;
    const max = 60;
    const priceInDollars = Math.random() * (max - min) + min;
    const priceInEuros = (priceInDollars * 0.85).toFixed(2);
    return priceInEuros;
  }
}