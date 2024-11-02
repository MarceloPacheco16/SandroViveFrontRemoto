import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as forge from 'node-forge';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  publicKey: string;
    
  // Usar la URL base desde el archivo de entorno
  publicKeyUrl = `${environment.apiUrl}/get-public-key/`;
  // private publicKeyUrl = 'http://localhost:8000/get-public-key/';

  constructor(private http: HttpClient) {
    
    // Colocamos la clave pública
    this.publicKey = `-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkwp4voaFy4KixR68DqXt
    p6OJ9SMkIN1ZTbb71YngS1FZU3IDWeOtvK1gddv0jlCiGcdCMxjS2sutNxVRFlb4
    w5KKcLI2VDY85azBejP8AetyvPbS9T18MCzuMo06cxrNhz/kW3SEqXaWVruDCZOM
    dBn/W3V8GVEjfBPQOMvzw8ctU/q/IhlvPtPGEesuTtIt9uvnYSLIaNR3deU8MdfE
    MEViD+AOXmT8pi9Q5eP1U0YcFP/FWYN8vOwJEl04smlOKLl3BNw4GgrgASU82wTJ
    BNse8PmKe1sx3gMoE1ZFiasmcdZKP4KODh/RRnuM7i4j9X33+L2ZbAHvOwBvFQtm
    HQIDAQAB
    -----END PUBLIC KEY-----`;
  }

  // // Método para obtener la clave pública desde el servidor
  // private getPublicKey(): Observable<string> {
  //   return this.http.get<any>(this.publicKeyUrl).pipe(
  //     map(response => response.public_key)
  //   );
  // }

  // // Método para encriptar datos usando la clave pública
  // encrypt(data: string): Observable<string> {
  //   return this.getPublicKey().pipe(
  //     switchMap(publicKey => {
  //       const rsa = forge.pki.publicKeyFromPem(publicKey);
  //       const encrypted = rsa.encrypt(data, 'RSA-OAEP');
  //       return forge.util.encode64(encrypted);
  //     })
  //   );
  // }
  encrypt(data: string): string {
    // Cargamos la clave pública usando Forge
    const rsa = forge.pki.publicKeyFromPem(this.publicKey);
    // Encriptamos los datos usando el esquema RSA-OAEP
    const encrypted = rsa.encrypt(data, 'RSA-OAEP');
    // Codificamos el resultado en base64 y lo retornamos
    return forge.util.encode64(encrypted);
  }

  
  // public encryptData(data: string, publicKeyPem: string): string {
  //   const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

  //   const encrypted = publicKey.encrypt(data, 'RSA-OAEP', {
  //     md: forge.md.sha256.create(),
  //     mgf1: {
  //       md: forge.md.sha1.create()
  //     }
  //   });

  //   return forge.util.encode64(encrypted);
  // }
}
