main: clean erlang_conf.pegjs
	pegjs erlang_conf.pegjs
	node test

clean:
	rm -rf erlang_conf.js
