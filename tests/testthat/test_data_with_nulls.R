context("Check data with nulls")

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

cp_rf_B <- cp_rf_A
cp_rf_C <- cp_rf_A
cp_rf_B$m2.price <- NA
cp_rf_C$m2.price[1] <- NA

test_that("Check data with nulls",{

  expect_error(ceterisParibusD3(cp_rf_B), NULL)
  expect_output(ceterisParibusD3(cp_rf_C), 'Removed')

})
