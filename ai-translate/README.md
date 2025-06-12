# Usage

```bash
# initial python3 virtual env folder
$ python3 -m venv $HOME/tmp/python3
# load virtual env vars
$ source $HOME/tmp/python3/bin/activate
# install dependencies
> python3 -m pip install -e .

> python3 -m ai_translate -h
> python3 -m ai_translate -d -c config.toml -n worker-us-1 -q ai.translate.us

# exit the virtual env
> deactivate
```
