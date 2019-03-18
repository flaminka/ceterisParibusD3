#' Create interactive D3-based Ceteris Paribus Explanations Plots
#'
#' Function 'ceterisParibusD3' plots interactive version of Ceteris Paribus Plots available in ceterisParibus package.
#' Various parameters help to decide what (profiles, aggregated profiles, points or rugs) and how it should be plotted.
#'
#' @param model a ceteris paribus explainer produced with function `ceteris_paribus()` from ceterisParibus package
#' @param ... other explainers that shall be plotted together
#' @param selected_variables if not NULL then only `selected_variables` will be presented
#' @param color a character. Either name of a color or name of a variable that should be used for coloring. If color is a categorical variable, it should have max. 9 categories. Use '_label_' to color by model type
#' @param width a numeric. Width (in px) of the whole plot
#' @param height a numeric. Heigth (in px) of the whole plot
#' @param no_colors a numeric. Number of colors in legend for sequential scales (currently available: between 1 and 9)
#' @param is_categorical_ordered a logical. If TRUE categorical variables values on x axis will be sorted alphabetically
#' @param size_rugs a numeric. Size of rugs to be plotted, between 0 and 1
#' @param alpha_rugs a numeric between 0 and 1. Opacity of rug lines
#' @param color_rugs a character. Name of a color. If NULL elements are plotted according to 'color' arguments
#' @param color_points a character. Name of a color. If NULL elements are plotted according to 'color' arguments
#' @param color_residuals a character. Name of a color. If NULL elements are plotted according to 'color' arguments
#' @param color_pdps a character. Name of a color.
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
#' @param auto_resize a logical. If FALSE plot's elements (like fonts or lines) won't be automatically resized when changinh size of the window.
#'
#' @import htmlwidgets ceterisParibus DALEX
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
                             no_colors = 3,
                             is_categorical_ordered  = FALSE,
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
                             auto_resize = TRUE
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


    all_variables <- na.omit(as.character(unique(all_profiles$`_vname_`)))
    # prepare variables (only numerical)
    is_numeric <- sapply(all_profiles[, all_variables, drop = FALSE], is.numeric)
    all_numeric_variables <- names(which(is_numeric))


    # check for Inf in numeric columns

    all_profiles$comb <- paste0(all_profiles[,c('_vname_')],'|', all_profiles[,c('_ids_')], '|', all_profiles[,c('_label_')])
    all_profiles$comb2 <- paste0(all_profiles[,c('_ids_')], '|', all_profiles[,c('_label_')])
    nrow_start <-nrow(all_profiles)

    rows_no_to_remove <-unique(unlist(sapply( all_numeric_variables, function(x){
      return(which(is.infinite(all_profiles[,c(x)])))
    })))

    # check for NA in columns and save rows to be removed
    rows_no_to_remove <- unique(c(rows_no_to_remove, which(rowSums(is.na(all_profiles)) > 0)))

    # remove specific id/label/variable comb from profiles
    rows_to_remove <- all_profiles$comb[rows_no_to_remove]
    rows_to_remove2 <- all_profiles$comb2[rows_no_to_remove]
    all_profiles <- all_profiles[!(all_profiles$comb %in% rows_to_remove),]

    all_profiles$comb <- NULL
    all_profiles$comb2 <- NULL

    if(nrow_start - nrow(all_profiles) > 0){
      cat('Removed', nrow_start - nrow(all_profiles), "profile row(s) with NA values.\n" )
      if(nrow(all_profiles) == 0){
        stop('There is no data to visualize.\n')
      }
    }

    # remove specific id/label comb from observation
    all_observations$comb <- paste0( all_observations[,c('_ids_')], '|', all_observations[,c('_label_')])
    nrow_start <-nrow(all_observations)
    all_observations <- all_observations[!(all_observations$comb %in% rows_to_remove2),]
    all_observations$comb <- NULL


    if(nrow_start - nrow(all_observations) > 0){
      cat('Removed', nrow_start - nrow(all_observations), "observation row(s) with NA values.\n" )
      if(nrow(all_observations) == 0){
        stop('There is no data to visualize.\n')
      }
    }


  if(is.null(selected_variables)){
      selected_variables <- all_variables
      #if (length(selected_variables) == 0) stop("There are no (numerical) variables")
    } else{
      selected_variables <- intersect(selected_variables, all_variables)
      if (length(selected_variables) == 0) stop(paste0("selected_variables do not overlap with ",
                                                       paste(all_variables, collapse = ", ")))
    }

    # prepare data filtered by variables
    all_profiles <- all_profiles[all_profiles$`_vname_` %in% selected_variables, ]

    if(length(selected_variables) == 1){ #artificially giving second element in order to treat as array
      selected_variables <- c(selected_variables, selected_variables)
      is_one_variable_given <- 'true'
    } else{
      is_one_variable_given <- 'false'
    }

    # check number of categories of color variable

    isColor <- function(x) {
      sapply(x, function(X) {
        tryCatch(is.matrix(col2rgb(X)),
                 error = function(e) FALSE)
      })
    }

    if(is.null(color) || is.na(color) ){
      color <- color
    } else if(length(color) != 1) {
      stop("'color' has length > 1")
    } else if(!isColor(color) & (color != '_label_')){
      if(!(color %in% all_variables)){
        stop("'color' is not a variable from given dataset nor a correct color name")
      }else if(is.character(all_profiles[,c(color)]) ||is.factor(all_profiles[,c(color)]) ){
        if( length(unique(all_profiles[,c(color)])) > 10){  #chosen d3 color scale has 12 colors
          stop(paste('Color variable has too many categories. Available: 10, given:',
                     length(unique(all_profiles[,c(color)])), '(reduce no of categories)'))
        }
      }else{
        stopifnot(length(no_colors) == 1)
        stopifnot(class(no_colors) == 'numeric')
        stopifnot(no_colors >=1 && no_colors <=9)
      }
    }

    # categorical order

    if(is_categorical_ordered){

      #prepare categorical variables
      is_categorical <- sapply(all_profiles[, all_variables, drop = FALSE], function(x) {return(is.character(x)||is.factor(x))})
      cat_variables <- names(which(is_categorical))

      if(length(cat_variables) > 0 && !is.na(cat_variables)){

        values <- lapply(cat_variables, function(x){ return(sort(unique(as.character(all_profiles[,c(x)]))))})
        names(values) <- cat_variables

        noCol = max(sapply(values, function(x){length(x)}))

        df <- data.frame(matrix(ncol = noCol+1, nrow = 0))
        colnames(df) <- c('variable', paste('rank', 1:noCol, sep =''))


        for(i in 1:length(cat_variables)){
            df[i,] <- c(names(values)[i], values[[i]], rep(NA,noCol-length(values[[i]])) )
        }
        categorical_order <- df

      }

    } else {
      categorical_order <- NULL
    }

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
      auto_resize = auto_resize
    )

    # pass the data and settings using 'x'
    x <- list(
      data = all_profiles,
      dataObs = all_observations,
      options = options,
      is_one_variable_given = is_one_variable_given
    )

    # define data transformation function
    attr(x, 'TOJSON_ARGS') <- list(pretty = TRUE, factor = 'string', null ='null', na = 'null', dataframe = 'rows')


    # create the widget
    htmlwidgets::createWidget("ceterisParibusD3", x,# width = width, height = height,
                              sizingPolicy =  htmlwidgets::sizingPolicy(padding = 0, browser.fill = TRUE
                                                                       #,viewer.suppress = TRUE,knitr.figure = FALSE
                                                                        ))
  }

