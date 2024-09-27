import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'seminario-septiembre';
  http = inject(HttpClient)
  githubUrl: string = 'https://api.github.com/users?per_page=100'
  githubUsers: any = []

  ngOnInit(): void{
    this.onEjectuarMetodos()
    this.onEjectuarMetodosAsync()
    this.onEjecutarMetodosEnParalelo()
    this.onGetGithubUsers()
    this.onGetGithubUsersAsync()
    this.onGetGithubUsersCallback((users, error) =>{
      if(error) console.log(`Ocurrió un error: ${JSON.stringify(error)}`)
      else{
        this.githubUsers = users
        console.log("users ", this.githubUsers)
      }
    })
  }


  contarHasta10000(): Promise<number>{
    return new Promise((resolve) =>{
      let i: number = 0;
      for(i=0; i<= 10000; i++){
        i++;
      }
      resolve(i)
    })
  }

  encontrarNumerosPares(): Promise<number>{
    return new Promise((resolve) =>{
      let i: number = 0;
      let esPar: boolean = false;
      for(i=0; i<=10000; i++){
        if(i%2==0) esPar
      }
      resolve(i)
    })
  }

  onEjectuarMetodos(){
    console.time('tiempo de ejecucion sin async await')
    this.contarHasta10000()
    .then(() => this.encontrarNumerosPares()).then(() =>{
      console.timeEnd("tiempo de ejecucion sin async await")
      console.log("finalizado")
    })
  }

  async onEjectuarMetodosAsync(){
    console.time('tiempo de ejecucion async await')
    await this.contarHasta10000();
    await this.encontrarNumerosPares()
    console.timeEnd("tiempo de ejecucion async await")
  }

  async onEjecutarMetodosEnParalelo(){
    console.time('tiempo de ejecucion en paralelo')
    await Promise.all([this.contarHasta10000(), this.encontrarNumerosPares()]);
    console.timeEnd("tiempo de ejecucion en paralelo")
  }


  onGetGithubUsers(): Promise<any>{
    console.time('tiempo api github')
    return this.http.get(this.githubUrl).toPromise()
    .then(users =>{
      this.githubUsers = users
      console.timeEnd('tiempo api github')
    })
    .catch(error =>{
      console.log(`Ocurrió un error: ${JSON.stringify(error)}`)
    })
  }

  async onGetGithubUsersAsync(): Promise<any>{
    try{
      console.time('tiempo api github async await')
      const users = await this.http.get(this.githubUrl).toPromise();
      this.githubUsers = users
      console.timeEnd('tiempo api github async await')
    }
    catch(error){
      console.log(`ocurrió un error: ${JSON.stringify(error)}`)
    }
  }

  onGetGithubUsersCallback(callback: (users: any, error?: any) => void): void {

    this.http.get(this.githubUrl).subscribe(
      (users) => {
        callback(users);
      },
      (error) => {
        console.log(`ocurrió un error: ${JSON.stringify(error)}`);
      }
    );
  }
}
//
