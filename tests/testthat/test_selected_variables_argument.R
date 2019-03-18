context("Check selected_variables argument")

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

test_that("Check selected_variables argument",{

  expect_error(ceterisParibusD3(cp_rf_A, selected_variables = 'randomName'),
    NULL)
  expect_error(ceterisParibusD3(cp_rf_A, selected_variables = '_label_'),
    NULL)
  expect_silent(    ceterisParibusD3(cp_rf_A,  selected_variables = NULL)  )
  expect_silent(    ceterisParibusD3(cp_rf_A, selected_variables = c("surface","construction.year")))
})
