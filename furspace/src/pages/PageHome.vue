<template>
  <q-page class="constrain q-pa-md">
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-8">
        <template v-if="!loadingPosts && posts.length">
          <q-card
            v-for="(post, index) in posts"
            :key="post.id"
            class="card-post q-mb-md"
            flat
            bordered
          >
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label
                  >Dog is feeling
                  <strong>{{ post.emotion }}</strong></q-item-label
                >
                <q-item-label caption>{{ post.location }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-img :src="post.imageURL"></q-img>
            <q-card-section>
              <div class="text-body1">{{ post.caption }}</div>
              <div class="text-caption text-grey">
                {{ formattedDates[index] }}
              </div>
            </q-card-section>
          </q-card>
        </template>
        <template v-else>
          <q-card flat bordered>
            <q-item width="380px">
              <q-item-section avatar>
                <q-skeleton type="QAvatar" animation="pulse" size="40px" />
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" animation="pulse" />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" animation="pulse" />
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-skeleton height="500px" square animation="pulse" />

            <q-card-section>
              <q-skeleton
                type="text"
                class="text-subtitle2"
                animation="pulse"
              />
              <q-skeleton
                type="text"
                width="50%"
                class="text-subtitle2"
                animation="pulse"
              />
            </q-card-section>
          </q-card>
        </template>
      </div>
      <div class="col-4 large-screen-only">
        <q-item class="fixed">
          <q-item-section avatar>
            <q-avatar size="48px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Avi Cabral </q-item-label>
            <q-item-label caption>Hello World</q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </div>
  </q-page>
</template>

<script>
import { date } from "quasar";
export default {
  name: "PageHome",
  data() {
    return {
      posts: [],
      loadingPosts: false,
      contentStyle: {
        backgroundColor: "rgba(0,0,0,0.02)",
        color: "#555",
      },

      contentActiveStyle: {
        backgroundColor: "#eee",
        color: "black",
      },

      thumbStyle: {
        right: "2px",
        borderRadius: "5px",
        backgroundColor: "#027be3",
        width: "5px",
        opacity: "0.75",
      },
    };
  },
  computed: {
    formattedDates() {
      const formatted = this.posts.map((post) =>
        this.formatNiceDate(post.date)
      );
      return formatted;
    },
  },
  methods: {
    getPosts() {
      this.loadingPosts = true;
      this.$axios
        .get(`${process.env.API}/posts`)
        .then((response) => {
          this.posts = response.data;
          // console.log(this.posts);
          // this.posts = [];
          this.loadingPosts = false;
        })
        .catch((error) => {
          this.$q.dialog({
            title: "Error",
            message: "There was a problem loading your feed 😔",
          });
        });
      this.loadingPosts = false;
    },

    formatNiceDate(value) {
      const formattedString = date.formatDate(new Date(value), "MMMM D h:mm A");
      return formattedString;
    },
  },
  created() {
    this.getPosts();
  },
};
</script>
