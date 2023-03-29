
import partie_json.JupyterServer as JupyterServer
import partie_json.Notebook as Notebook
from flask import Flask, request
import sys
import logging

app = Flask(__name__)
handler = logging.StreamHandler(sys.stdout)
app.logger.addHandler(handler)


def main():
    """ fonction principale permettant de lancer le serveur flask
    """
    app.run()


@app.route('/preview', methods=['POST'])
def lancement_preview():
    """fonction permettant de lancer le serveur jupyter et d'ouvrir un notebook
    """
    mon_serveur = JupyterServer.JupyterServer()
    mon_serveur.run_server()
    mon_serveur.open_browser()
    mon_serveur.stop_server()


@app.route('/import_data', methods=['GET', 'POST'])
def import_data():
    """ fonction permettant d'importer des données dans un notebook"""

    request_data = request.get_json()

    file_path = request_data['file_path']
    file_name = request_data['file_name']

    mon_notebook = Notebook.Notebook("temp")
    mon_notebook.save()
    mon_notebook.import_data(file_path, file_name)

    return "import réussi !"


@app.route('/', methods=['GET', 'POST'])
def hello():
    """ simple fonction permettant de tester le serveur à l'aide d'un navigateur
    """
    return "Le serveur marche !"


if __name__ == "__main__":
    main()