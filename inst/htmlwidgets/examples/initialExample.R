library("DALEX")
library("randomForest")
library("ceterisParibus")
library(ceterisParibusD3)
set.seed(59)

model <- randomForest(status ~ gender + age + hours + evaluation + salary, data = HR)

pred1 <- function(m, x)   predict(m, x, type = "prob")[,1]
pred2 <- function(m, x)   predict(m, x, type = "prob")[,2]
pred3 <- function(m, x)   predict(m, x, type = "prob")[,3]

explainer_rf_fired <- explain(model, data = HR[,1:5], 
                              y = HR$status == "fired", 
                              predict_function = pred1, label = "fired")
explainer_rf_ok <- explain(model, data = HR[,1:5], 
                           y = HR$status == "ok", 
                           predict_function = pred2, label = "ok")
explainer_rf_promoted <- explain(model, data = HR[,1:5], 
                                 y = HR$status == "promoted", 
                                 predict_function = pred3, label = "promoted")

cp_rf1 <- ceteris_paribus(explainer_rf_fired, HR[1,])
cp_rf2 <- ceteris_paribus(explainer_rf_ok, HR[1,])
cp_rf3 <- ceteris_paribus(explainer_rf_promoted, HR[1,])

ceterisParibusD3(cp_rf1, cp_rf2, cp_rf3, selected_variables = c('age'), color = "_label_",
                 width = 500, height = 300)


