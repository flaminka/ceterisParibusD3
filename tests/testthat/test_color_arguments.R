context("Check color options")

library("DALEX")
library("randomForest")
library("ceterisParibus")
library("rpart")
library("e1071")
library(ceterisParibusD3)

apartments_rf_model <- randomForest(m2.price ~ construction.year + surface + floor +
                                      no.rooms + district,
                                    data = apartments)

explainer_rf <- explain(apartments_rf_model,
                        data = apartmentsTest[,2:6],
                        y = apartmentsTest$m2.price)

apartments_A <- apartmentsTest[c(958,955),]

cp_rf_A <- ceteris_paribus(explainer_rf, apartments_A, y = apartments_A$m2.price)

test_that("Check color variable",{

  expect_error(
    ceterisParibusD3(cp_rf_A, show_profiles = TRUE, show_observations = TRUE,
                     color = 'reddit',
                     selected_variables = c("surface","construction.year")),
    NULL)
  expect_error(
  ceterisParibusD3(cp_rf_A, show_profiles = TRUE, show_observations = TRUE,
                   color = 'labelka',
                   selected_variables = c("surface","construction.year")),
  NULL)
  expect_silent(    ceterisParibusD3(cp_rf_A, show_profiles = TRUE, show_observations = TRUE,
                                     color = 'red',
                                     selected_variables = c("surface","construction.year")))
  expect_silent(    ceterisParibusD3(cp_rf_A, show_profiles = TRUE, show_observations = TRUE,
                                     color = NULL,
                                     selected_variables = c("surface","construction.year")))
})


test_that("Check no_colors variable",{
  expect_error(
    ceterisParibusD3(cp_rf_A, show_profiles = TRUE, show_observations = TRUE,
                     color = 'surface', no_colors = c(1,2),
                     selected_variables = c("surface","construction.year")),
    NULL)
  expect_error(
    ceterisParibusD3(cp_rf_A, show_profiles = TRUE, show_observations = TRUE,
                     color = 'surface', no_colors = 'c(1,2)',
                     selected_variables = c("surface","construction.year")),
    NULL)
  expect_error(
    ceterisParibusD3(cp_rf_A, show_profiles = TRUE, show_observations = TRUE,
                     color = 'surface', no_colors = 0,
                     selected_variables = c("surface","construction.year")),
    NULL)
  expect_error(
    ceterisParibusD3(cp_rf_A, show_profiles = TRUE, show_observations = TRUE,
                     color = 'surface', no_colors = 15,
                     selected_variables = c("surface","construction.year")),
    NULL)
  expect_silent(    ceterisParibusD3(cp_rf_A, show_profiles = TRUE, show_observations = TRUE,
                                     color = 'surface', no_colors = 9,
                                     selected_variables = c("surface","construction.year")))
})









