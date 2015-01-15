setup:
	@echo "Creating FOXX application file"
	rm -f guesser-foxx.zip
	cd .. && zip docker/guesser-foxx.zip guesser.js manifest.json scripts/setup.js scripts/teardown.js

	@echo "Creating NODE application file"
	rm -f guesser-node.tar
	cd ../nodejs && tar cvf ../docker/guesser-node.tar .
