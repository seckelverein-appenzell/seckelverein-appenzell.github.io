class SiteNavbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
      <nav class="navbar bg-base-100 shadow-lg px-4 md:px-8 fixed top-0 z-[100]">
        <div class="navbar-start">
          <a href="/index.html" class="flex items-center gap-3 no-underline group">
            <div class="avatar">
              <div class="w-10 h-10 rounded-full">
                <img src="/static/img/logo.jpg" alt="Seckelverein Logo" class="object-cover" />
              </div>
            </div>
            <span class="text-xl font-black italic tracking-tighter uppercase text-base-content group-hover:text-orange-600 transition-colors">
              Seckelverein <span class="text-orange-600 hidden sm:inline">Appenzell</span>
            </span>
          </a>
        </div>

        <div class="navbar-end">
          <!-- Desktop Menu -->
          <div class="hidden md:flex">
            <ul class="menu menu-horizontal px-1 font-bold gap-2 items-center text-base">
              <li><a href="/calculator.html" class="hover:text-orange-600">Rechner</a></li>
              <li>
                <details class="dropdown dropdown-end">
                  <summary class="hover:text-orange-600 flex items-center gap-1 cursor-pointer">Strava</summary>
                  <ul class="p-2 shadow menu dropdown-content z-[2] bg-base-100 rounded-box w-52 mt-4 border border-base-300">
                    <li>
                      <a href="https://www.strava.com/clubs/1619291" target="_blank" class="flex justify-between">
                        Club Seite
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 opacity-40"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                      </a>
                    </li>
                    <li>
                      <a href="https://www.strava.com/clubs/1619291/posts/new" target="_blank" class="flex justify-between">
                        Neuer Post
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 opacity-40"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                      </a>
                    </li>
                  </ul>
                </details>
              </li>
              <li>
                <details class="dropdown dropdown-end">
                  <summary class="hover:text-orange-600 flex items-center gap-1 cursor-pointer">Spiele</summary>
                  <ul class="p-2 shadow menu dropdown-content z-[2] bg-base-100 rounded-box w-52 mt-4 border border-base-300">
                    <li><a href="/chooser.html">Chooser</a></li>
                    <li><a href="/cube.html">Würfel</a></li>
                  </ul>
                </details>
              </li>
            </ul>
          </div>

          <!-- Mobile Menu -->
          <div class="dropdown dropdown-end md:hidden">
            <label class="btn btn-ghost btn-circle swap swap-rotate">
              <input type="checkbox" id="mobile-menu-checkbox" class="peer" />
              <svg class="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 512 512">
                <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"/>
              </svg>
              <svg class="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 512 512">
                <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"/>
              </svg>
              <ul class="menu bg-base-100 rounded-box w-64 shadow-2xl border border-base-300 absolute top-14 right-0 mt-3 hidden peer-checked:block z-[50] font-bold text-left">
                <li>
                  <h2 class="menu-title text-orange-600 uppercase italic">Tools</h2>
                  <ul><li><a href="/calculator.html">Rechner</a></li></ul>
                </li>
                <li>
                  <h2 class="menu-title text-orange-600 uppercase italic border-t border-base-200 mt-2 pt-2">Strava</h2>
                  <ul>
                    <li><a href="https://www.strava.com/clubs/1619291" target="_blank" class="flex justify-between items-center">Club Seite <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 opacity-40"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg></a></li>
                    <li><a href="https://www.strava.com/clubs/1619291/posts/new" target="_blank" class="flex justify-between items-center">Neuer Post <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 opacity-40"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg></a></li>
                  </ul>
                </li>
                <li>
                  <h2 class="menu-title text-orange-600 uppercase italic border-t border-base-200 mt-2 pt-2">Spiele</h2>
                  <ul>
                    <li><a href="/chooser.html">Chooser</a></li>
                    <li><a href="/cube.html">Würfel</a></li>
                  </ul>
                </li>
              </ul>
            </label>
          </div>
        </div>
      </nav>
    `;

        // Aktive Seite im Nav highlighten
        this.querySelectorAll('a[href]').forEach(link => {
            if (link.href === window.location.href) {
                link.classList.add('text-orange-600');
            }
        });
    }
}

customElements.define('site-navbar', SiteNavbar);