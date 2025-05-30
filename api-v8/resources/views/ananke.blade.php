<html lang="en-us">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

    <title>Ananke: a Hugo Theme | Ananke</title>
    <meta name="viewport" content="width=device-width,minimum-scale=1" />
    <meta
      name="description"
      content="The last theme you'll ever need. Maybe."
    />
    <meta name="generator" content="Hugo 0.92.1" />

    <meta name="robots" content="noindex, nofollow" />

    <link rel="stylesheet" href="{{ URL::asset('assets/css/ananke/main.min.css') }}" />

    <link
      href="/index.xml"
      rel="alternate"
      type="application/rss+xml"
      title="Ananke"
    />
    <link
      href="/index.xml"
      rel="feed"
      type="application/rss+xml"
      title="Ananke"
    />

    <meta property="og:title" content="Ananke: a Hugo Theme" />
    <meta
      property="og:description"
      content="The last theme you'll ever need. Maybe."
    />
    <meta property="og:type" content="website" />
    <meta
      property="og:url"
      content="https://gohugo-ananke-theme-demo.netlify.app/"
    />
    <meta property="og:site_name" content="Ananke" />

    <meta itemprop="name" content="Ananke: a Hugo Theme" />
    <meta
      itemprop="description"
      content="The last theme you'll ever need. Maybe."
    />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="Ananke: a Hugo Theme" />
    <meta
      name="twitter:description"
      content="The last theme you'll ever need. Maybe."
    />
  </head>

  <body
    class="ma0 avenir bg-near-white"
  >
    <header
      class="cover bg-top"
      style="background-image: url('{{ URL::asset('assets/images/hero.jpg') }}');"
    >
      <div class="bg-black-60">
        <nav class="pv3 ph3 ph4-ns" role="navigation">
          <div class="flex-l justify-between items-center center">
            <a href="/" class="f3 fw2 hover-white no-underline white-90 dib">
              wikipali
            </a>
            <div class="flex-l items-center">
              <h4></h4>
              <ul class="pl0 mr3">
                @foreach ($nav as $item)
                <li class="list f5 f4-ns fw4 dib pr3">
                  <a
                    class="hover-white no-underline white-90"
                    href="/pcd/{{ $item['link'] }}"
                    title="{{ $item['title'] }}"
                  >
                    {{ $item['title'] }}
                  </a>
                </li>
                @endforeach
              </ul>

            </div>
          </div>
        </nav>

        <div class="tc-l pv4 pv6-l ph3 ph4-ns">
          <h1 class="f2 f-subheadline-l fw2 white-90 mb0 lh-title">
            {{ $title }}
          </h1>

          <h2 class="fw1 f5 f3-l white-80 measure-wide-l center mt3">
          {{ $subtitle }}
          </h2>
        </div>
      </div>
    </header>

    <main class="pb7" role="main">
      <article
        class="cf ph3 ph5-l pv3 pv4-l f4 tc-l center measure-wide lh-copy mid-gray"
      >
        <p>
          Welcome to my blog with some of my work in progress. I’ve been working
          on this book idea. You can read some of the chapters below.
        </p>
      </article>

      <div class="pa3 pa4-ns w-100 w-70-ns center">
        <section class="w-100 mw8">
          <div class="relative w-100 mb4">
            <article class="bb b--black-10">
              <div class="db pv4 ph3 ph0-l no-underline dark-gray">
                <div class="flex flex-column flex-row-ns">
                  <div class="pr3-ns mb4 mb0-ns w-100 w-40-ns">
                    <a href="/post/chapter-6/" class="db grow">
                      <img
                        src="https://gohugo-ananke-theme-demo.netlify.app/images/esmeralda.jpg"
                        class="img"
                        alt="image from Chapter VI: Esmeralda"
                      />
                    </a>
                  </div>

                  <div class="blah w-100 w-60-ns pl3-ns">
                    <h1 class="f3 fw1 athelas mt0 lh-title">
                      <a href="/post/chapter-6/" class="color-inherit dim link">
                        Chapter VI: Esmeralda
                      </a>
                    </h1>
                    <div
                      class="f6 f5-l lh-copy nested-copy-line-height nested-links"
                    >
                      We are delighted to be able to inform the reader, that
                      during the whole of this scene, Gringoire and his piece
                      had stood firm. His actors, spurred on by him, had not
                      ceased to spout his comedy, and he had not ceased to
                      listen to it. He had made up his mind about the tumult,
                      and was determined to proceed to the end, not giving up
                      the hope of a return of attention on the part of the
                      public.
                    </div>
                    <a
                      href="/post/chapter-6/"
                      class="ba b--moon-gray bg-light-gray br2 color-inherit dib f7 hover-bg-moon-gray link mt2 ph2 pv1"
                      >read more</a
                    >
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div class="relative w-100 mb4">
            <article class="bb b--black-10">
              <div class="db pv4 ph3 ph0-l no-underline dark-gray">
                <div class="flex flex-column flex-row-ns">
                  <div class="blah w-100">
                    <h1 class="f3 fw1 athelas mt0 lh-title">
                      <a href="/post/chapter-5/" class="color-inherit dim link">
                        Chapter V: Quasimodo
                      </a>
                    </h1>
                    <div
                      class="f6 f5-l lh-copy nested-copy-line-height nested-links"
                    >
                      In the twinkling of an eye, all was ready to execute
                      Coppenole’s idea. Bourgeois, scholars and law clerks all
                      set to work. The little chapel situated opposite the
                      marble table was selected for the scene of the grinning
                      match. A pane broken in the pretty rose window above the
                      door, left free a circle of stone through which it was
                      agreed that the competitors should thrust their heads. In
                      order to reach it, it was only necessary to mount upon a
                      couple of hogsheads, which had been produced from I know
                      not where, and perched one upon the other, after a
                      fashion.
                    </div>
                    <a
                      href="/post/chapter-5/"
                      class="ba b--moon-gray bg-light-gray br2 color-inherit dib f7 hover-bg-moon-gray link mt2 ph2 pv1"
                      >read more</a
                    >
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div class="relative w-100 mb4">
            <article class="bb b--black-10">
              <div class="db pv4 ph3 ph0-l no-underline dark-gray">
                <div class="flex flex-column flex-row-ns">
                  <div class="blah w-100">
                    <h1 class="f3 fw1 athelas mt0 lh-title">
                      <a href="/post/chapter-4/" class="color-inherit dim link">
                        Chapter IV: Master Jacques Coppenole
                      </a>
                    </h1>
                    <div
                      class="f6 f5-l lh-copy nested-copy-line-height nested-links"
                    >
                      While the pensioner of Ghent and his eminence were
                      exchanging very low bows and a few words in voices still
                      lower, a man of lofty stature, with a large face and broad
                      shoulders, presented himself, in order to enter abreast
                      with Guillaume Rym; one would have pronounced him a
                      bull-dog by the side of a fox. His felt doublet and
                      leather jerkin made a spot on the velvet and silk which
                      surrounded him.
                    </div>
                    <a
                      href="/post/chapter-4/"
                      class="ba b--moon-gray bg-light-gray br2 color-inherit dib f7 hover-bg-moon-gray link mt2 ph2 pv1"
                      >read more</a
                    >
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section class="w-100">
          <h1 class="f3">More</h1>

          <h2 class="f5 fw4 mb4 dib mr3">
            <a href="/post/chapter-3/" class="link black dim">
              Chapter III: Monsieur the Cardinal
            </a>
          </h2>

          <h2 class="f5 fw4 mb4 dib mr3">
            <a href="/post/chapter-2/" class="link black dim">
              Chapter II: Pierre Gringoire
            </a>
          </h2>

          <h2 class="f5 fw4 mb4 dib mr3">
            <a href="/post/chapter-1/" class="link black dim">
              Chapter I: The Grand Hall
            </a>
          </h2>

          <a
            href="/post/"
            class="link db f6 pa2 br3 bg-mid-gray white dim w4 tc"
            >All Articles</a
          >
        </section>
      </div>
    </main>
    <footer class="bg-black bottom-0 w-100 pa3" role="contentinfo">
      <div class="flex justify-between">
        <a
          class="f4 fw4 hover-white no-underline white-70 dn dib-ns pv2 ph3"
          href="https://gohugo-ananke-theme-demo.netlify.app"
        >
          © Ananke 2022
        </a>
        <div>
          <div class="ananke-socials">
            <a
              href="https://twitter.com/GoHugoIO"
              target="_blank"
              class="twitter ananke-social-link link-transition stackoverflow link dib z-999 pt3 pt0-l mr1"
              title="Twitter link"
              rel="noopener"
              aria-label="follow on Twitter——Opens in a new window"
            >
              <span class="icon"
                ><svg
                  style="enable-background: new 0 0 67 67"
                  version="1.1"
                  viewBox="0 0 67 67"
                  xml:space="preserve"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                >
                  <path
                    d="M37.167,22.283c-2.619,0.953-4.274,3.411-4.086,6.101  l0.063,1.038l-1.048-0.127c-3.813-0.487-7.145-2.139-9.974-4.915l-1.383-1.377l-0.356,1.017c-0.754,2.267-0.272,4.661,1.299,6.271  c0.838,0.89,0.649,1.017-0.796,0.487c-0.503-0.169-0.943-0.296-0.985-0.233c-0.146,0.149,0.356,2.076,0.754,2.839  c0.545,1.06,1.655,2.097,2.871,2.712l1.027,0.487l-1.215,0.021c-1.173,0-1.215,0.021-1.089,0.467  c0.419,1.377,2.074,2.839,3.918,3.475l1.299,0.444l-1.131,0.678c-1.676,0.976-3.646,1.526-5.616,1.568  C19.775,43.256,19,43.341,19,43.405c0,0.211,2.557,1.397,4.044,1.864c4.463,1.377,9.765,0.783,13.746-1.568  c2.829-1.673,5.657-5,6.978-8.221c0.713-1.716,1.425-4.851,1.425-6.354c0-0.975,0.063-1.102,1.236-2.267  c0.692-0.678,1.341-1.419,1.467-1.631c0.21-0.403,0.188-0.403-0.88-0.043c-1.781,0.636-2.033,0.551-1.152-0.402  c0.649-0.678,1.425-1.907,1.425-2.267c0-0.063-0.314,0.042-0.671,0.233c-0.377,0.212-1.215,0.53-1.844,0.72l-1.131,0.361l-1.027-0.7  c-0.566-0.381-1.361-0.805-1.781-0.932C39.766,21.902,38.131,21.944,37.167,22.283z M33,64C16.432,64,3,50.569,3,34S16.432,4,33,4  s30,13.431,30,30S49.568,64,33,64z"
                    style="fill-rule: evenodd; clip-rule: evenodd"
                  ></path>
                </svg>
              </span>

              <span class="new-window"
                ><svg
                  height="8px"
                  style="enable-background: new 0 0 1000 1000"
                  version="1.1"
                  viewBox="0 0 1000 1000"
                  xml:space="preserve"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                >
                  <path
                    d="M598 128h298v298h-86v-152l-418 418-60-60 418-418h-152v-86zM810 810v-298h86v298c0 46-40 86-86 86h-596c-48 0-86-40-86-86v-596c0-46 38-86 86-86h298v86h-298v596h596z"
                    style="fill-rule: evenodd; clip-rule: evenodd"
                  ></path>
                </svg> </span
            ></a>
          </div>
        </div>
      </div>
    </footer>

    <iframe
      frameborder="0"
      scrolling="no"
      style="background-color: transparent; border: 0px; display: none"
    ></iframe>
    <div
      id="GOOGLE_INPUT_CHEXT_FLAG"
      input=""
      input_stat='{"tlang":true,"tsbc":true,"pun":true,"mk":true,"ss":true}'
      style="display: none"
    ></div>
    <div id="monica-content-root" class="monica-widget"></div>
  </body>
</html>
