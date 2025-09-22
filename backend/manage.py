#!/usr/bin/env python
import os
import sys


def main():
    """Executa tarefas administrativas do Django."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "CardapioOnline.settings")

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        # Mensagem de erro mais informativa
        error_msg = (
            "Django não está instalado ou não foi encontrado.\n"
            "Certifique-se de que:\n"
            "1. Django está instalado: pip install django\n"
            "2. Seu ambiente virtual está ativado (se aplicável)\n"
            "3. Você está usando a versão correta do Python\n"
            f"Erro original: {exc}"
        )
        raise ImportError(error_msg) from exc

    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()