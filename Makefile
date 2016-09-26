
BACKEND_DIR = backend
VENV = `pwd`/${BACKEND_DIR}/env/bin/activate
test:
	. ${VENV} ; flake8 ${BACKEND_DIR}
	. ${VENV} ; nosetests ${BACKEND_DIR} -v --with-timer
	npm test
install:
	virtualenv  -p python3  ${BACKEND_DIR}/env
	. ${VENV} ; pip install --upgrade pip
	. ${VENV} ; pip install -r ${BACKEND_DIR}/requirements.txt
	npm install