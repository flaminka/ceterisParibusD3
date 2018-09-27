library("DALEX")
library("randomForest")
library("ceterisParibus")
library(ceterisParibusD3)


######### first example: one variable, 2 obs, 1 model

apartments_rf_model <- randomForest(m2.price ~ construction.year + surface + floor +
                                      no.rooms + district, 
                                    data = apartments)

explainer_rf <- explain(apartments_rf_model,
                        data = apartmentsTest[,2:6], 
                        y = apartmentsTest$m2.price)

apartments_A <- apartmentsTest[c(958, 353),]

cp_rf_A <- ceteris_paribus(explainer_rf, apartments_A, y = apartments_A$m2.price)

#plot(cp_rf_A, selected_variables = c("surface"), show_observations = FALSE)
ceterisParibusD3(cp_rf_A, selected_variables = c("surface"),  width = 500, height = 300)


######### second example: one variable, 2 obs, 2 models

apartments_lm_model <- lm(m2.price ~ construction.year + surface + floor + 
                            no.rooms + district, data = apartments)

apartments_rf_model <-randomForest(m2.price ~ construction.year + surface + floor + 
                                     no.rooms + district, data = apartments)

explainer_rf <- explain(apartments_rf_model, 
                        data = apartmentsTest[,2:6], y = apartmentsTest$m2.price)
explainer_lm <- explain(apartments_lm_model, 
                        data = apartmentsTest[,2:6], y = apartmentsTest$m2.price)

new_apartment <- apartmentsTest[c(1,2), ]

cp_rf <- ceteris_paribus(explainer_rf, observation = new_apartment)
cp_lm <- ceteris_paribus(explainer_lm, observation = new_apartment)

#plot(cp_rf, cp_lm, selected_variables = c("surface"), color = '_label_', show_observations = FALSE)

ceterisParibusD3(cp_rf, cp_lm, selected_variables = c("surface"), color = '_label_',  width = 500, height = 300)

######### third example: one variable, 2 obs, 1 model, 3 classes

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

#plot(cp_rf1, cp_rf2, cp_rf3, color="_label_", selected_variables = c('age'), show_observations = FALSE)

ceterisParibusD3(cp_rf1, cp_rf2, cp_rf3, selected_variables = c('age'), color = "_label_",
                 width = 500, height = 300)

######### forth example: two variables, many observations, 1 model

apartments_rf_model <- randomForest(m2.price ~ construction.year + surface + floor +
                                      no.rooms + district, 
                                    data = apartments)

explainer_rf <- explain(apartments_rf_model,
                        data = apartmentsTest[,2:6], 
                        y = apartmentsTest$m2.price)


apartments_B <- select_neighbours(apartmentsTest, apartmentsTest[958,], n = 15)
cp_rf_B <- ceteris_paribus(explainer_rf, apartments_B, y = apartments_B$m2.price)


#plot(cp_rf_B,  show_observations = FALSE, selected_variables = c("surface","construction.year"), color='_label_')

ceterisParibusD3(cp_rf_B, selected_variables = c("surface","construction.year"), color = "_label_",
                 width = 500, height = 300)
