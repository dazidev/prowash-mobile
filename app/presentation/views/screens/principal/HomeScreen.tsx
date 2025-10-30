import React, { useEffect, useState } from "react"
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native"
import { AdvText } from "../../components/home/AdvText"
import CleaningBackground from "../../components/CleaningBackground"
import { AdvImage } from "../../components/home/AdvImage"
import { AdvCarousel } from "../../components/home/AdvCarousel"
import { HomeScreenViewModel } from "../../../viewmodels/principal/HomeScreenViewModel"
import { AdsResponse } from "../../../../domain"


export const HomeScreen = () => {
  const { getAdvertising } = HomeScreenViewModel()
  const [data, setData] = useState<AdsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await getAdvertising();
        if (mounted) setData(res);
      } catch (e: any) {
        //if (mounted) //setErr(e?.message ?? "Error cargando anuncios"); //! hace falta mapear el error
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator />
      </View>
    );
  }

  const ads = data?.success ? data.data : [];

  return (
    <>
      <CleaningBackground />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {
          ads.map((ad) => {
            switch (ad.type) {
              case "TEXT":
                return <AdvText key={ad.id} text={ad.text!}/>;
              case "IMAGE":
                return <AdvImage key={ad.id} text={ad.text!} image={ad.image1!}/>;
              case "IMAGE_CAROUSEL":
                const images = {
                  image1: ad.image1,
                  image2: ad.image2,
                  image3: ad.image3,
                  image4: ad.image4,
                  image5: ad.image5,
                }
                return <AdvCarousel key={ad.id} text={ad.text!} images={images}/>;
              default:
                return null;
            }
          })
        }
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 60,
    alignContent: 'center'
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: 40,
    color: 'black',
    textAlign: 'center',
  }
})

