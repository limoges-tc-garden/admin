import ShowWhenAuthenticated from "~/components/ShowWhenAuthenticated";

/**
 * @route `/articles`
 */
export default function ArticlesView () {
  return (
    <ShowWhenAuthenticated>
      <h1>Articles</h1>
    </ShowWhenAuthenticated>
  )
};
