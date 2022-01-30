cloc:
	cloc css html js src *.js
dev:
	inspirecloud dev -p80
deploy:
	inspirecloud deploy
upload-tencent:
	# 部署到我的服务器
	rsync -r --progress *.js package.json node_modules dist core tencent:/home/ubuntu/app/GithubStatistic/
