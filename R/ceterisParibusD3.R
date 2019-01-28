#' Create interactive D3-based Ceteris Paribus Explanations Plots
#'
#' Function 'ceterisParibusD3' plots interactive version of Ceteris Paribus Plots available in ceterisParibus package.
#' Various parameters help to decide what (profiles, aggregated profiles, points or rugs) and how it should be plotted.
#'
#' @param model a ceteris paribus explainer produced with function `ceteris_paribus()` from ceterisParibus package
#' @param ... other explainers that shall be plotted together
#' @param selected_variables if not NULL then only `selected_variables` will be presented
#' @param color a character. Either name of a color or name of a variable that should be used for coloring
#' @param width a numeric. Width (in px) of the whole plot
#' @param height a numeric. Heigth (in px) of the whole plot
#' @param no_colors a numeric. Number of colors in legend for sequential scales
#' @param categorical_order a list. List with order of values for categorical variables in form as follows: list(variableName = c('category1', 'category2'), variableName2 = c('category3', 'category4'))
#' @param size_rugs a numeric. Size of rugs to be plotted
#' @param alpha_rugs a numeric between 0 and 1. Opacity of rug lines
#' @param color_rugs a character. Name of a color. If NULL elements are plotted according to 'color' arguments
#' @param color_points a character. Name of a color. If NULL elements are plotted according to 'color' arguments
#' @param color_residuals a character. Name of a color. If NULL elements are plotted according to 'color' arguments
#' @param color_pdps a character. Name of a color. If NULL elements are plotted according to 'color' arguments
#' @param alpha_residuals a numeric between 0 and 1. Opacity of residuals
#' @param alpha_points a numeric between 0 and 1. Opacity of points
#' @param alpha_ices a numeric between 0 and 1. Opacity of ICE lines
#' @param alpha_pdps a numeric between 0 and 1. Opacity of PDP lines
#' @param size_points a numeric. Size of points to be plotted
#' @param size_residuals a numeric. Size of residuals (lines and points) to be plotted
#' @param size_ices a numeric. Size of ICE lines to be plotted
#' @param size_pdps a numeric. Size of PDP lines to be plotted
#' @param show_profiles a logical. If TRUE then individual profiles will be plotted
#' @param show_observations a logical. If TRUE then individual observations will be marked as points
#' @param show_rugs a logical. If TRUE then individual observations will be marked as rugs
#' @param show_residuals a logical. If TRUE then residuals will be plotted as a line ended with a point
#' @param aggregate_profiles a character. Either 'mean' or 'median'. If not NULL then profiles will be aggregated according to chosen metric and the aggregate profiles will be plotted
#' @param add_table a logical. If TRUE then table will be plotted, default is TRUE
#' @param font_size_titles a numeric. Font size in px of subplots titles
#' @param font_size_legend a numeric. Font size in px of texts in legend
#' @param font_size_axes a numeric. Font size in px of texts on axes
#' @param font_size_tootlips a numeric. Font size in px of texts in tooltip
#' @param font_size_table a numeric. Font size in px of texts in table
#' @param font_size_plot_title a numeric. Font size in px of plot main title
#' @param plot_title a character. Main title of the plot
#' @param yaxis_title a character. Vertical (y) axis title of the plot
#' @param legend_keys_size a numeric. Size of legend keys in px
#'
#' @import htmlwidgets ceterisParibus
#'
#' @return a ceterisParibusD3 object
#' @name ceterisParibusD3
#' @export
#'
#' @examples
#'
#'  \dontrun{
#' library("DALEX")
#' library("ceterisParibusD3")
#' library("ceterisParibus")
#' library("randomForest")
#' set.seed(59)
#'
#'
#' apartments_rf_model <- randomForest(m2.price ~ construction.year + surface + floor +
#'                                      no.rooms + district,
#'                                    data = apartments)
#'
#' explainer_rf <- explain(apartments_rf_model,
#'                        data = apartmentsTest[,2:6],
#'                        y = apartmentsTest$m2.price)
#'
#' apartments_A <- apartmentsTest[958,]
#' cp_rf_A <- ceteris_paribus(explainer_rf, apartments_A, y = apartments_A$m2.price)
#'
#' # plot in ceterisParibus package
#' plot(cp_rf_A, show_profiles = TRUE, show_observations = TRUE,
#'     selected_variables = c("surface","construction.year"))
#'
#' # interactive version from ceterisParibusD3 package
#' ceterisParibusD3(cp_rf_A, show_profiles = TRUE, show_observations = TRUE,
#'                 selected_variables = c("surface","construction.year"), add_table = FALSE)
#'
#'}
#'

ceterisParibusD3 <- function(model, ...,
                             selected_variables = NULL,
                             color = NULL,
                             width = NULL,
                             height = NULL,
                             no_colors = NULL,
                             categorical_order  = NULL,
                             size_rugs  = NULL,
                             alpha_rugs = NULL,
                             color_rugs = NULL,
                             color_points = NULL,
                             color_residuals = NULL,
                             color_pdps = NULL,
                             alpha_residuals = NULL,
                             alpha_points = NULL,
                             alpha_ices = NULL,
                             alpha_pdps = NULL,
                             size_points = NULL,
                             size_residuals = NULL,
                             size_ices = NULL,
                             size_pdps = NULL,
                             show_profiles = TRUE,
                             show_observations = TRUE,
                             show_rugs = NULL,
                             show_residuals = NULL,
                             aggregate_profiles = NULL,
                             font_size_titles = NULL,
                             font_size_legend = NULL,
                             font_size_axes = NULL,
                             font_size_tootlips = NULL,
                             font_size_table = NULL,
                             add_table = NULL,
                             font_size_plot_title = NULL,
                             plot_title = NULL,
                             yaxis_title = NULL,
                             legend_keys_size = NULL
) {

    # prepare data
    dfl <- c(list(model), list(...))

    labels <- sapply(dfl, function(d){ unique(d$'_label_') })

    if(length(unique(labels)) == 1  & length(labels) > 1){

      labels <- paste(labels, seq_along(labels), sep="")

      dfl <- lapply(seq_along(labels), function(n){
        dfl[[n]]$'_label_' <- rep(labels[n], length(dfl[[n]]$'_label_'))
        attr(dfl[[n]], 'observations')$'_label_'  <- rep(labels[n], length(attr(dfl[[n]], 'observations')$'_label_'))
        return(dfl[[n]])
      })

    }

    all_profiles <- do.call(rbind, dfl)
    class(all_profiles) <- "data.frame"

    all_observations <- lapply(dfl, function(tmp) {
      attr(tmp, "observations")$`_ids_` <- rownames(attr(tmp, "observations"))
      attr(tmp, "observations")
    })

    all_observations <- do.call(rbind, all_observations)

    # prepare variables (only numerical)
    all_variables <- na.omit(as.character(unique(all_profiles$`_vname_`)))
    #is_numeric <- sapply(all_profiles[, all_variables, drop = FALSE], is.numeric)
    #all_variables <- names(which(is_numeric))

    if(is.null(selected_variables)){
      selected_variables <- all_variables
      #if (length(selected_variables) == 0) stop("There are no (numerical) variables")
    } else{
      selected_variables <- intersect(all_variables, selected_variables)
      if (length(selected_variables) == 0) stop(paste0("selected_variables do not overlap with ",
                                                       paste(all_variables, collapse = ", ")))
    }

    # prepare data filtered by variables
    all_profiles <- all_profiles[all_profiles$`_vname_` %in% selected_variables, ]

    if(length(selected_variables) == 1){ #artificially giving second element in order to treat as array
      selected_variables <- c(selected_variables, selected_variables)
    }


    if(!is.null(categorical_order)){
      noCol = max(sapply(categorical_order, function(x){length(x)}))

      df <- data.frame(matrix(ncol = noCol+1, nrow = 0))
      colnames(df) <- c('variable', paste('rank', 1:noCol, sep =''))
      i<-1
      for(i in 1:length(categorical_order)){
        df[i,] <- c(names(categorical_order)[i], as.character(categorical_order[[i]]), rep(NA,noCol-length(categorical_order[[i]])) )
      }
      categorical_order <- df
    }


    # categorical_order: [
    #   { 'variable': 'district',
    #     'rank1': "Bielany",
    #     'rank2': "Bemowo",
    #     'rank3': "Mokotow",
    #     'rank4': "Ochota",
    #     'rank5': "Praga",
    #     'rank6': "Srodmiescie",
    #     'rank7': "Ursus",
    #     'rank8': "Ursynow",
    #     'rank9': "Wola",
    #     'rank10': "Zoliborz"
    #   }
    #   ]

    # gdzies jeszcze w kodzie JS zamienic dana ramke na JS obiekt

    # set settings
    options <- list(
      variables = selected_variables,
      color = color,
      no_colors = no_colors,
      categorical_order = categorical_order,
      height = height,
      width = width,
      size_rugs = size_rugs,
      alpha_rugs = alpha_rugs,
      color_rugs = color_rugs,
      color_points = color_points,
      color_residuals = color_residuals,
      color_pdps = color_pdps,
      alpha_residuals = alpha_residuals,
      alpha_points = alpha_points,
      alpha_ices = alpha_ices,
      alpha_pdps = alpha_pdps,
      size_points = size_points,
      size_residuals = size_residuals,
      size_ices = size_ices,
      size_pdps = size_pdps,
      show_profiles = show_profiles,
      show_observations = show_observations,
      show_rugs = show_rugs,
      show_residuals = show_residuals,
      aggregate_profiles = aggregate_profiles,
      font_size_titles = font_size_titles,
      font_size_legend = font_size_legend,
      font_size_axes = font_size_axes,
      font_size_tootlips = font_size_tootlips,
      font_size_table = font_size_table,
      add_table = add_table,
      font_size_plot_title = font_size_plot_title,
      plot_title = plot_title,
      yaxis_title = yaxis_title,
      legend_keys_size = legend_keys_size
    )

    # pass the data and settings using 'x'
    x <- list(
      data = all_profiles,
      dataObs = all_observations,
      options = options
    )

    # define data transformation function
    attr(x, 'TOJSON_ARGS') <- list(pretty = TRUE, factor = 'string', null ='null', na = 'null', dataframe = 'rows')


    # create the widget
    htmlwidgets::createWidget("ceterisParibusD3", x, width = width, height = height,
                              sizingPolicy =  htmlwidgets::sizingPolicy(padding = 0, browser.fill = TRUE
                                                                       #,viewer.suppress = TRUE,knitr.figure = FALSE
                                                                        ))
  }

