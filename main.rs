use rand;
use rocket::{
    fs::{relative, FileServer},
    request::Request,
    response::content::RawJson,
    serde::json::{serde_json::{Value as Json, json}, serde_json},
};
use rocket_dyn_templates::{context, handlebars::handlebars_helper, Template};

#[macro_use]
extern crate rocket;

#[get("/number")]
fn api_index() -> RawJson<String> {
    RawJson(json!({
        "msg-type": "success",
        "number": rand::random::<u64>()
    }).to_string())
}

#[catch(404)]
fn api_not_found(request: &Request) -> RawJson<String> {
    RawJson(json!({
        "msg-type": "error",
        "error-code": 404,
        "route": request.uri()
    }).to_string())
}

#[catch(404)]
fn not_found(request: &Request) -> Template {
    Template::render(
        "pages/404",
        context! {
           url: request.uri()
        },
    )
}

#[get("/")]
fn index() -> Template {
    Template::render("pages/home", context! {})
}

#[launch]
fn rocket() -> _ {
    handlebars_helper!(fallback: |*args| {
        let mut result = Json::Null;
        for value in args {
            match value {
                Json::Null => (),
                _ => {
                    result = value.clone();
                    break;
                }
            };
        }
        result
    });

    rocket::build()
        .attach(Template::custom(|engines| {
            engines
                .handlebars
                .register_helper("fallback", Box::new(fallback));
        }))
        .register("/", catchers![not_found])
        .mount("/", routes![index])
        .register("/api", catchers![api_not_found])
        .mount("/api", routes![api_index])
        .mount("/", FileServer::from(relative!("public")))
}
