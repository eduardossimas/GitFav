import { GithubUser } from './GithubUser.js';

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root);
        this.load();
        GithubUser.search("eduardossimas").then(user => console.log(user));
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
    }

    save() {
        localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
    }

    async add(username) {
        try {
            const userExists = this.entries.find((user) => user.login === username);
            if(userExists) {
                throw new Error("Usuário já adicionado!");
            }

            const user = await GithubUser.search(username);
            
            if(user.login === undefined) {
                throw new Error("Usuário não encontrado!");
            }

            this.entries = [user, ...this.entries];
            this.update();
            this.save();

        } catch(e) {
            alert(e.message);
        }
    }

    delete(user) {
        const filterEntries = this.entries.filter(entry => entry.login !== user.login);
    
        this.entries = filterEntries;
        this.update();
        this.save();
    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root);

        this.tbody = this.root.querySelector("table tbody");

        this.update();
        this.onadd();
    }

    onadd() {
        const addButton = this.root.querySelector(".search button");
        addButton.onclick = () => {
            const { value } = this.root.querySelector(".search input");

            this.add(value);
        }
    }

    update() {
        if(this.entries.length === 0) {
            this.root.querySelector(".empty").classList.remove("hidden");
        } else {
            this.root.querySelector(".empty").classList.add("hidden");
        }

        this.removeAllTer();

        this.entries.forEach(user => {
            const row = this.createRow();

            row.querySelector(".user img").src = `https://github.com/${user.login}.png`;
            row.querySelector(".user img").alt = `Avatar de ${user.name}`;

            row.querySelector(".user a").href = `https://github.com/${user.login}`;
            row.querySelector(".user p").textContent = user.name;
            row.querySelector(".user span").textContent = user.login;

            row.querySelector(".repositories").textContent = user.public_repos;

            row.querySelector(".followers").textContent = user.followers;

            row.querySelector(".remove").onclick = () => {
                const isOk = confirm("Deseja realmente remover?");
                if(isOk) {
                    this.delete(user);
                }
            }

            this.tbody.append(row);
        });
    }

    createRow() {
        const tr = document.createElement("tr");

        const content = `<td class="user">
                        <img src="https://github.com/eduardossimas.png" alt="Avatar do usuário">
                        <a href="https:github.com/eduardossimas" target="_blank">
                            <p>Eduardo Salzer</p>
                            <span>eduardossimas</span>
                        </a>
                    </td>
                    <td class="repositories">100</td>
                    <td class="followers">1000</td>
                    <td>
                        <button class="remove">Remover</button>
                    </td>`;
        
        tr.innerHTML = content;
        return tr;
    }

    removeAllTer() {
        this.tbody.querySelectorAll("tr").forEach(tr => tr.remove());
    }

    isEmpty() {

    }

}