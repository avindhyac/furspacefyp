<template>
  <q-page class="constrain q-pa-md">
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-8">
        <q-card
          v-for="post in posts"
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
                >{{ post.user }} is feeling
                <strong>{{ post.emotion }}</strong></q-item-label
              >
              <q-item-label caption>{{ post.location }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />

          <q-img :src="post.imgURL"></q-img>
          <q-card-section>
            <div class="text-body1">{{ post.caption }}</div>
            <div class="text-caption text-grey">{{ post.date | niceDate }}</div>
          </q-card-section>
        </q-card>
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
      posts: [
        {
          id: 1,
          user: "Tucker",
          emotion: "happy",
          location: "Mirihana, Sri Lanka",
          date: 1710799030927,
          caption: "I like biting people",
          imgURL: "https://cdn.quasar.dev/img/parallax2.jpg",
        },
        {
          id: 2,
          user: "Tucker",
          emotion: "happy",
          location: "Mirihana, Sri Lanka",
          date: 1710799030927,
          caption: "I like biting people",
          imgURL: "https://cdn.quasar.dev/img/parallax2.jpg",
        },
        {
          id: 3,
          user: "Tucker",
          emotion: "happy",
          location: "Mirihana, Sri Lanka",
          date: 1710799030927,
          caption: "I like biting people",
          imgURL: "https://cdn.quasar.dev/img/parallax2.jpg",
        },
        {
          id: 4,
          user: "Tucker",
          emotion: "happy",
          location: "Mirihana, Sri Lanka",
          date: 1710799030927,
          caption: "I like biting people",
          imgURL: "https://cdn.quasar.dev/img/parallax2.jpg",
        },
      ],
    };
  },
  filters: {
    niceDate(timeStamp) {
      const dateObject = new Date(timeStamp * 1000);
      const formattedDate = date.formatDate(dateObject, "MMMM D h:mm A");
      return formattedDate;
    },
  },
};
</script>
