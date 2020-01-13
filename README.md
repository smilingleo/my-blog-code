# My Personal Blog

Built on top of `Gatsby`.

## Steps to Deploy

1. Create markdown format file under `src/pages`

Note: The `date` property need to follow ISO-8601 format.

2. Run `yarn deploy`

3. Deploy

```bash
cd public
git add . && git commit -am 'new blog'
git push origin master
```

## To create a new blog post

```bash
./new.sh <title> <pathname>
```

For example, `./new.sh 'Sidecar pattern' sidecar-pattern`.
