import { Component, OnInit } from '@angular/core';
import { PublicKey } from '@solana/web3.js';
import { SquaresService } from '../squares.service';

@Component({
  selector: 'app-wallet-connect',
  template: `
    <button (click)="connectWallet()" *ngIf="!publicKey">Connect Wallet</button>
    <div *ngIf="publicKey">
      Connected: {{ publicKey.toBase58() }}
      <button (click)="disconnectWallet()">Disconnect</button>
    </div>
  `,
  styleUrls: ['./wallet-connect.component.css']
})
export class WalletConnectComponent implements OnInit {
  publicKey: PublicKey | null = null;
  isConnected: boolean = false;

  constructor(private squaresService: SquaresService) { }

  ngOnInit(): void {
    this.checkWalletConnection();
  }

  async checkWalletConnection() {
    this.isConnected = this.squaresService.isConnected;
    if (this.isConnected) {
      this.publicKey = this.squaresService.publicKey();
    }
  }

  async connectWallet() {
    if (!window.solana) {
      console.error("Solana wallet not found. Please install a wallet like Phantom or Solflare.");
      // Optionally, display an error message to the user
      return;
    }
    try {
      await this.squaresService.connectWallet(window.solana);
      this.isConnected = this.squaresService.isConnected;
      if (this.isConnected) {
        this.publicKey = this.squaresService.publicKey();
        }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  }

  async disconnectWallet() {
    try {
      await this.squaresService.disconnectWallet();
      this.publicKey = null;
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  }
  }