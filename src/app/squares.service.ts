import { Injectable } from '@angular/core';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, sendAndConfirmTransaction, TransactionInstruction, } from '@solana/web3.js';
import { BehaviorSubject, Observable, from, map } from 'rxjs';
import { WalletAdapter } from '@solana/wallet-adapter-base';
import { Program, Provider, web3 } from '@coral-xyz/anchor';
import { IDL } from './squares'; // Assuming you have your generated IDL file

// Replace with your actual program ID
const PROGRAM_ID = new PublicKey('YOUR_PROGRAM_ID');

// Interface for Board Data (adjust as needed based on your contract)
export interface Board {
  id: string;
  entryFee: number;
  payoutStructure: string;
  acceptedToken: string;
  gameDetails: string;
  // Add other fields as needed
}

@Injectable({
  providedIn: 'root',
})
export class SquaresService {
  private connection: Connection;
  private program: Program | undefined;
  private _publicKey = new BehaviorSubject<PublicKey | null>(null);
  publicKey$ = this._publicKey.asObservable();
  private wallet: WalletAdapter | undefined;

  constructor() {
    // Initialize connection here (e.g., use mainnet-beta, devnet, testnet)
    this.connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  }

  // Method to connect the wallet
  async connectWallet(wallet: WalletAdapter): Promise<void> {
    if (this.wallet) {
      return;
    }

    try {
      this.wallet = wallet;
      await this.wallet.connect();

       // Initialize the program after the wallet is connected
      await this.initializeProgram();

      console.log('Wallet connected:', this.wallet.publicKey?.toBase58());
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }
  async disconnectWallet() {
    try {
      // Assuming the wallet provider has a 'disconnect' method
      await this.wallet?.disconnect();
      this.wallet = undefined;
      
      this._publicKey.next(null); // Update the publicKey observable
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      throw error; // Re-throw the error to be caught in the component
    }
  }

  private async initializeProgram(): Promise<void> {
    if (!this.wallet || !this.wallet.publicKey) {
      throw new Error('Wallet not connected.');
    }

    const provider = new Provider(
      this.connection,
      this.wallet,
      { commitment: 'confirmed' }
    );
    this.program = new Program(IDL as any, PROGRAM_ID, provider);
  }

  get isConnected(): boolean {
    return !!this.wallet?.connected;
  }

  publicKey(): PublicKey | null {
    if (this.wallet) {
      this._publicKey.next(this.wallet?.publicKey || null)
      return this.wallet?.publicKey;
    } else {
      return null
    }
  }

  getBoards(): Observable<Board[]> {
    return from(this.fetchBoards()).pipe(map((boardsData) => {
      return boardsData.map((board) => {
        return {
          id: board.publicKey.toBase58(),
          entryFee: board.account.entryFee,
          payoutStructure: board.account.payoutStructure,
          acceptedToken: board.account.acceptedToken.toString(),
          gameDetails: board.account.gameDetails,
        };
      });
    }));
  }
  private async fetchBoards(): Promise<any[]> {
      if (!this.program) {
        throw new Error('Program not initialized.');
      }

      try {
        return await this.program.account.board.all();
      } catch (error) {
        console.error('Error fetching boards:', error);
        throw error;
      }
  }

  // Method to create a board
  async createBoard(boardData: any): Promise<string> { // Adjust boardData type as needed
    if (!this.program || !this.wallet?.publicKey) {
      throw new Error('Program or wallet not initialized.');
    }

    try {
      // Generate a new keypair for the board
      const boardKeypair = PublicKey.unique();
      
      // Add logic to create a board using your program methods
      const txHash = await this.program.methods
        .createBoard(
          boardData.entryFee,
          boardData.payoutStructure,
          new PublicKey(boardData.acceptedToken), // or parse correctly to PublicKey
          boardData.gameDetails
        )
        .accounts({
          board: boardKeypair,
          creator: this.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([]) // Add signers if needed
        .rpc();

      return txHash;
    } catch (error) {
      console.error('Error creating board:', error);
      throw error;
    }
  }


