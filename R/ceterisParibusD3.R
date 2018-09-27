#' Create interactive plot in D3 for ceterisParibus packages
#'
#' @import htmlwidgets
#'
#' @export

ceterisParibusD3 <- function(model, ..., 
                               selected_variables = NULL, color = NULL,
                               width = NULL, height = NULL, elementId = NULL) {
    
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
    is_numeric <- sapply(all_profiles[, all_variables, drop = FALSE], is.numeric)
    all_variables <- names(which(is_numeric))  
    
    if(is.null(selected_variables)){
      selected_variables <- all_variables
      if (length(selected_variables) == 0) stop("There are no (numerical) variables")
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
    
    # set settings
    settings <- list(
      selected_variables = selected_variables,
      color = color
    )
    
    # pass the data and settings using 'x'
    x <- list(
      data = all_profiles,
      dataObs = all_observations,
      settings = settings
    )
    
    # define data transformation function
    attr(x, 'TOJSON_ARGS') <- list(pretty = TRUE, factor = 'string', null ='null', na = 'null', dataframe = 'rows')
    
    
    # create the widget
    htmlwidgets::createWidget("ceterisParibusD3", x, width = width, height = height, elementId = elementId, 
                              sizingPolicy =  htmlwidgets::sizingPolicy(padding = 0, browser.fill = TRUE
                                                                       #,viewer.suppress = TRUE,knitr.figure = FALSE
                                                                        ))
  }
  

#' Shiny bindings for ceterisParibusD3
#'
#' Output and render functions for using ceterisParibusD3 within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a ceterisParibusD3
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name ceterisParibusD3-shiny
#'
#' @export
ceterisParibusD3Output <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'ceterisParibusD3', width, height, package = 'ceterisParibusD3')
}

#' @rdname ceterisParibusD3-shiny
#' @export
renderCeterisParibusD3 <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, ceterisParibusD3Output, env, quoted = TRUE)
}