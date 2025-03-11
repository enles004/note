from jinja2 import FileSystemLoader, Environment, select_autoescape


class Env:

    @staticmethod
    def set_env_mail(templates: str, filename: str, **kwargs) -> str:
        env = Environment(loader=FileSystemLoader(templates),
                          autoescape=select_autoescape())
        template = env.get_template(filename)
        body = template.render(kwargs)
        return body
