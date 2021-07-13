<template>
  <div class="yt_card bg2">
    <img
      class="yt_thumbnail"
      :src="ytTrack.thumbnails[0]"
    >
    <div class="card_body">
      <p class="yt_title">
        {{ ytTrack.title }}
      </p>
      <div
        v-if="ytTrack.publish_time == 0"
        class="live_indicator"
      >
        <p class="text-light text-small-1">
          🎙 {{ ytTrack.channel }}
        </p>
        <h4>Live 🔴</h4>
      </div>
      <div v-if="ytTrack.publish_time != 0">
        <div class="flex fade_to_8 flex_between">
          <p class="text-light text-small-1">
            🎙 {{ ytTrack.channel }}
          </p>
          <p class="text-light text-small-1">
            📅 {{ ytTrack.publish_time }}
          </p>
        </div>
        <div class="flex fade_to_8 flex_between">
          <p class="text-light text-small-1">
            ⏳ {{ ytTrack.duration }}
          </p>
          <p class="text-light text-small-1">
            {{ ytTrack.views }}
          </p>
          <!-- <p>{{ytTrack.views}}</p> -->
        </div>
      </div>
    </div>
    <div class="card_actions">
      <base-button
        icon="play"
        @click.native="playVideo"
      />
      <base-button
        v-if="!trackAlreadyDownloaded && ytTrack.publish_time != 0"
        icon="cloud-arrow-down"
        :loading="isBeingDownloaded"
        @click.native="downloadVideoAudioFeed"
      />
      <base-button
        v-if="trackAlreadyDownloaded"
        icon="check"
      />
    </div>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron';
  import { mapMutations } from 'vuex';
  import { cleanUpText } from '@/shared-utils';

  export default {
    name: 'YoutubeTrack',

    computed: {
      trackAlreadyDownloaded() {
        const index = this.$store.state.TabsManager.tabsData.addedTracks.findIndex(
            track => track.defaultTitle == cleanUpText(this.ytTrack.title)
              && track.defaultArtist == this.ytTrack.artist
          );
        if (index > -1) {
          return true;
        }
        return false;
      },
      isBeingDownloaded() {
        return (
          this.$store.state.BingDownloadManager.pendingDownloads.findIndex(
            track => track.id === this.ytTrack.id
          ) != -1
        );
      }
    },
    methods: {
      ...mapMutations(['addTrackToPendingDownloads']),
      playVideo() {
        const iframeSrc = `https://www.youtube.com/embed/${this.ytTrack.id}?autoplay=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1`;

        this.$emit('playYTVideo', iframeSrc);
      },
      downloadVideoAudioFeed() {
        const trackInfo = {
          id: this.ytTrack.id,
          title: this.ytTrack.title,
          artist: {
            name: this.ytTrack.channel
          }
        };
        this.addTrackToPendingDownloads({
          ...trackInfo,
          progressInfo: {
            speed: 0,
            total: 0,
            progress: 0
          },
          downloadURL: ''
        });

        const myHeaders = new Headers();
        myHeaders.append('accept', 'application/json');
        myHeaders.append('X-API-KEY', 'RPHGBA-YTUUDP-FUZWMW-YBAEGW-ARQ');
        const requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };
        fetch(
          `https://thearq.tech/ytdl?url=https://www.youtube.com/watch?v=${this.ytTrack.id}`,
          requestOptions
        )
          .then(response => response.text())
          .then(result => {
            const responseRes = JSON.parse(result);
            const videoFormats = responseRes.result.video;
            console.log('Fetching');
            console.log(videoFormats);
            if (videoFormats.length) {
              const audioFeed = videoFormats[videoFormats.length - 1].url;
              this.sendTrackForDownload(trackInfo, audioFeed);
            }
          })
          .catch(() => {
            //   this.updatePendingTrackState({
            //     id: this.trackInfo.id,
            //     stateCode: 2,
            //   });
          });
        // sd
      },
      sendTrackForDownload(trackInfo, url) {
        const tags = {
          title: cleanUpText(trackInfo.title),
          artist: trackInfo.artist.name,
          album: 'YouTube',
          APIC: this.ytTrack.thumbnails[this.ytTrack.thumbnails.length - 1]
        };
        const artistInfo = {
          name: trackInfo.artist.name,
          picture: ''
        };
        ipcRenderer.send('downloadBingTrack', {
          trackURL: url,
          trackID: this.ytTrack.id,
          tags,
          artistInfo
        });
      }
    },
    props: {
      ytTrack: Object
    }
  };
</script>

<style lang="scss">
  .yt_card {
    padding: 10px;
    border-radius: 15px;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    &:hover {
      .card_actions {
        opacity: 1;
      }
    }
    .yt_thumbnail {
      border-radius: 15px;
      width: 100%;
    }
    .yt_title {
      overflow: hidden;
      width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 0.95rem;
      font-family: inherit;
    }
    .card_actions {
      position: absolute;
      top: 90px;
      right: 10px;
      width: 100%;
      display: flex;
      justify-content: flex-end;
      // opacity: 0;
      button {
        backdrop-filter: blur(40px);
        //   width: 50px;
        //   height: 50px;
        margin: 10px;
      }
    }
    .live_indicator {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transform: translateY(5px);
      h4 {
        background: rgb(220, 20, 60);
        padding: 4px;
        border-radius: 10px;
        font-size: 0.9rem;
      }
      box-shadow: 5px 5px solid black;
      border-radius: 20px;
    }
  }
</style>
