# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Deployment

This project is deployed via [GitHub Pages](https://pages.github.com/).

To deploy the latest version:

1. Ensure the latest code is committed and pushed to the `main` (or `master`) branch.
2. Run the following command to build the project:
   ```
   npm run build
   ```
3. Deploy the build directory using the `gh-pages` package or your chosen method. If using `gh-pages`, run:
   ```
   npm install --save-dev gh-pages
   npm run deploy
   ```
   _(Make sure your `package.json` includes the correct `homepage` field and deploy script.)_

The site will be available at `https://<your-github-username>.github.io/<repo-name>/`.

## `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Icon Animations

This project uses [Lordicon](https://lordicon.com/) for animated icons. Browse their library to add more icons or change existing ones.
