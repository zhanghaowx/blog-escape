# &lt;Escape /&gt;

Escape is a responsive jekyll theme based on [Harmony](https://github.com/gayanvirajith/harmony).

- Built for jekyll 2.x
- Fluidly responsive
- Supports Google analytics and RSS feeds
- Browser support: IE 8+, Chrome, Safari and Firefox

## Contents

- [How to install/run](#how-to-installrun)
- [Options/Usage](#optionsusage)
  - [Header navigation links](#header-navigation-links)
  - [Footer links](#footer-links)
  - [Copyrights/Disclaimer statements](#copyrightsdisclaimer-statements)
- [License](#license)

## How to install/run

1. [Fork](https://github.com/zhanghaowx/Escape/fork) this repository.
2. If you're completely new to jekyll, please read more about [Jekyll](http://jekyllrb.com/) and [Github pages](https://help.github.com/articles/using-jekyll-with-pages).
3. Run the jekyll server by `rake preview` in cloned repository.

Point your browser to [http://localhost:4000](http://localhost:4000).

Note: If you are a windows user please refer to this nice website - http://jekyll-windows.juthilo.com by Julian Thilo to configure ruby + jekyll on windows.

## Options/Usage

Escape has some customizable options. All the configuration details are
configured in `_config.yml` file under root directory.

Feel free to change your `name`, `descriptionn`, `meta_description`, `author details`,
`social media names` and `Google analytics id` accordingly.

### Includes

All the partial includes are under `_includes` directory.

#### Header navigation links

Feel free to add/edit links for your header in the file `header-links.html`.

#### Footer links

Customize your footer links by editing `_includes/footer-links.html`

#### Copyrights/Disclaimer statements

All copyright notes are under `_includes/footer.html`. Also note that you
can toggle on/off copyright notes from the front-end by setting up `show_disclaimer`
property in `_config.yml`.

## License

Free / Open sourced under the
[MIT](https://github.com/zhanghaowx/Escape/blob/master/LICENSE.md).
