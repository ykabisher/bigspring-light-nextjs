<h1 align=center>Bigspring Light Nextjs</h1> 
<p align=center>Bigspring is a web development business template built in Nextjs. Perfect for Creative Agency, Marketing Agency, Design Studios, Digital Marketing Agencies, and other business service websites.</p>
<h2 align="center"> <a target="_blank" href="https://bigspring-light-nextjs.vercel.app/" rel="nofollow">Demo</a> | <a  target="_blank" href="https://pagespeed.web.dev/report?url=https%3A%2F%2Fbigspring-light-nextjs.vercel.app%2F&form_factor=desktop">Page Speed (100%)</a>
</h2>

<p align=center>
  <a href="https://github.com/vercel/next.js/releases/tag/v13.0.6" alt="Contributors">
    <img src="https://img.shields.io/static/v1?label=NEXTJS&message=13.0&color=000&logo=nextjs" />
  </a>

  <a href="https://github.com/themefisher/bigspring-light-nextjs/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/themefisher/bigspring-light-nextjs" alt="license"></a>

  <img src="https://img.shields.io/github/languages/code-size/themefisher/bigspring-light-nextjs" alt="code size">

  <a href="https://github.com/themefisher/bigspring-light-nextjs/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/themefisher/bigspring-light-nextjs" alt="contributors"></a>
</p>

<!-- download -->
## Download

Download this template from [Github](https://github.com/themefisher/bigspring-light-nextjs/archive/main.zip)

<!-- download -->
## Deploying On LightSail (installs nodejs, nginx, pm2)
Ref: https://www.willandskill.se/en/articles/setup-a-next-js-project-with-pm2-nginx-and-yarn-on-ubuntu-18-04
- curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
- sudo apt-get install -y nodejs
- sudo apt-get install nginx
- sudo npm install pm2 -g
- pm2 startup systemd
- git clone https://github.com/ykabisher/bigspring-light-nextjs.git
- pm2 start npm run --name "nextjs" -- start
- sudo vim /etc/nginx/sites-available/default

```
location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```
service nginx restart
```


To see the list of all the running processes, run the following command:

```
pm2 list
```

To stop an application, run the following command:
```
pm2 stop <app_name_or_id>
```

To see the logs of a process, run the following command:
- pm2 logs <process_name>

Display all apps logs in realtime
- pm2 logs


## Key Features
- Simple and Minimal
- Fully Responsive
- Google Page Speed score 100! (Desktop)
- Google analytics support
- Caching enabled
- Supports Contact Form
- SEO Friendly
<!-- installation -->
## Installation

After downloading the template, you have some prerequisites to install. Then you can run it on your localhost. You can view the package.json file to see which scripts are included.

### Install prerequisites (once for a machine)

* **Node Installation:** [Install node js](https://nodejs.org/en/download/) [Recommended LTS version]

### Local setup

After successfully installing those dependencies, open this template with any IDE [[VS Code](https://code.visualstudio.com/) recommended], and then open the internal terminal of IDM [vs code shortcut <code>ctrl/cmd+\`</code>]

* Install dependencies

```
npm install
```

* Run locally

```
npm run dev
```

After that, it will open up a preview of the template in your default browser, watch for changes to source files, and live-reload the browser when changes are saved.

## Production Diploy

After finishing all the customization, you can create a production build by running this command.

```
cd bigspring-light-nextjs/
git pull
yarn
npm run build
pm2 list
pm2 stop <app_name_or_id>
pm2 start npm run --name "nextjs" -- start
```
