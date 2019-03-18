context("Check `model` argument")

#check if output of ceteris_paribus doesn't changed (the same class, proper columns)

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

test_that("Input ceterisParibus data check",{
  expect_is(cp_rf_A, "ceteris_paribus_explainer")
  expect_is(cp_rf_A, "data.frame")
  expect_is(attr(cp_rf_A, 'observations'), "data.frame")
})


test_that("Missing columns in ceterisParibus data ",{
  expect_true(sum(c('_ids_', '_label_', '_vname_', '_yhat_') %in% colnames(cp_rf_A)) == 4 )
  expect_true(sum(c('_y_', '_label_', '_yhat_') %in% colnames(attr(cp_rf_A, 'observations'))) == 3)
})







