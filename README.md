# 🛡️ Argument Steelmanner

Paste in any opinion or argument, and this app writes back the **strongest
possible counter-argument** against it — a genuine "steelman," not a weak
strawman — so you can pressure-test your own thinking.

All AI inference runs **fully on-device**, powered by
[QVAC](https://github.com/tetherto/qvac), Tether's open-source local AI SDK.
There is no cloud call, no API key, and no data ever leaves your machine.

## How it works

It will help you especially when it comes to debate

- A small Node.js/Express server loads a language model locally using the
  `@qvac/sdk` package (`loadModel`).
- When you submit an opinion from the web page, the server calls the model's
  `completion` function to generate the counter-argument, on your own CPU.
- The very first time you run it, QVAC automatically downloads the model file
  it needs (a few hundred MB) to your machine. After that, it's fully offline.

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer installed on your computer.
- About 1–2 GB of free disk space (for the downloaded model).

## Install

```bash
git clone <this-repo-url>
cd argument-steelmanner
npm install
```

## Run

```bash
npm start
```

Then open **http://localhost:3000** in your browser.

The first time you click "Steelman it," the model will download and load —
this can take a minute or two, and you can watch progress in the terminal.
Every request after that is fast.

## SDK version used

- `@qvac/sdk` `^0.19.0`
- Model: `LLAMA_3_2_1B_INST_Q4_0` (small, fast, good for a demo like this)

## Project structure

```
argument-steelmanner/
├── server.js          # Express server + QVAC model loading & completion call
├── public/
│   └── index.html     # Simple front-end page
├── package.json
└── README.md
```

## License

MIT — see [LICENSE](./LICENSE).
