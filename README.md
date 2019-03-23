# ceterisParibusD3

## Intro

Machine learning has been recently one of the hottest topics in business and science. In different settings, starting from the intuitive financial ones, through medical usages and ending in high-tech ones as speech recognition, people try to predict outcomes using different statistical models. Previously used algorithms such as linear regression, however simple and interpretable, now often give way to new, more effective models that unfortunately due to their complexity lack interpretability. To maintain both accuracy and interpretability of the model we can use model explanation techniques (so-called eXplainable Artificial Intelligence, XAI) that aim to explain such black-box models through various approaches. One of the most fundamental questions that can be posed regarding model explanation is how model response depends on features from a dataset, which can be answered using *Ceteris Paribus Profiles*. Such profiles show for given observation how model response would change with the change of its value for given variable, while keeping all other variables fixed (hence the name *Ceteris Paribus* - Latin phrase for *all else unchanged*).

## ceterisParibusD3 package

`ceterisParibusD3` package is an interactive (D3 based) extension (built as htmlwidget) of plots from [ceterisParibus]( https://github.com/pbiecek/ceterisParibus) R package. It allows user to plot standard charts from the parent package for *Ceteris Paribus profiles* , i.e. each chart can include:

- **ICE** curves for single observation / group of observation / whole dataset
- **PDP** curves that aggregate chosen ICE curves
- **observation points**  and **rugs** corresponding to chosen ICE curves
- **residuals** corresponding to chosen ICE curves

Each chart can be also divided into subplots (panels) per variable from dataset and be coloured by variable (to see interactions between variables) or model type (to compare model behaviours).

`ceterisParibusD3` package adds to these plots:

- **tooltips** (shows info about given element (line, point) after hovering over it, hovering over an element causes also highlighting it on given panel (increasing its stroke, opacity or size) and highlighting elements related to the same data point in other panels)

- **interactive table** (user can hover over each row, which causes highlighting elements related to this observation and hiding unrelated elements (apart from rugs and pdps), also filtering and sorting rows is available)

<center><img width="600" src="images/interactivity.jpg"></center>

D3 engine of this R package `ceterisParibusD3` is available [here](https://github.com/ModelOriented/ceterisParibusD3), its implementation in Python is [`pyCeterisParibus`](https://github.com/ModelOriented/pyCeterisParibus).

## Installation

To install package use R command:

```
devtools::install_github(repo = 'flaminka/ceterisParibus' )
```

## Dependencies

`ceterisParibusD3` depends on R package [htmwidget](https://www.htmlwidgets.org/) that integrates JS code from [ceterisParibusD3.js](https://github.com/MI2DataLab/ceterisParibusExt/tree/master/ceterisParibusD3) with R. Both of them are automatically attached during installation.

Because `ceterisParibusD3` is a purely visualization package, it is suggested to install also R packages [ceterisParibus](https://github.com/pbiecek/ceterisParibus) and [DALEX](https://github.com/pbiecek/DALEX) that prepare data for our package (as shown e.g [here](inst/htmlwidgets/examples/more_examples.html)).

## Examples

ICE curves for single observation:

<center><img width="600" src="images/individual_plot.jpg"></center>

ICE curves for single observation - model comparison:

<center><img width="600" src="images/mutlimodel_plot.jpg"></center>

## More examples

To see more examples and comparison to plots from [ceterisParibus]( https://github.com/pbiecek/ceterisParibus) package check [this file](inst/htmlwidgets/examples/more_examples.html).


## Documentation

To see help use R command:

```
?ceterisParibusD3::ceterisParibusD3
```

or see [manual](manual.pdf)


## Issues and suggestions

To report a bug or propose a new feature please review these guidelines:

* make sure you have the latest version of the package
* check whether it is not already in [Issues](https://github.com/flaminka/ceterisParibusD3/issues)
* add an issue following suitable template: for [bugs](https://github.com/flaminka/ceterisParibusD3/blob/master/bug_template.md) or for [suggestions](https://github.com/flaminka/ceterisParibusD3/blob/master/suggestion_template.md)

       
## Acknowledgments

Work on this package is financially supported by the NCN Opus grant 2017/27/B/ST6/01307.
     
       

